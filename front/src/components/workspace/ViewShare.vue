<template>
  <v-container fluid class="ma-0 pa-0">
    <v-card id="share_block" height="653px" class="ma-0 pa-0">
    <img absolute :src="unloaded_img" id="first" alt="">
      <v-btn color="primary" class='btns' v-if="sharing_possible" v-show="sharing_user_id != user.user_id" @click="sharing_user_id = user.user_id">Share Mine</v-btn>
      <v-btn color="error" class='btns' v-if="sharing_possible" v-show="sharing_user_id == user.user_id" @click="sharing_user_id = 'no one'">Stop Share</v-btn>
    </v-card>
  </v-container>
</template>

<script>
const stun_server = "stun.l.google.com:19302";
const pcConfig = {
  iceServers: [
    {
      urls: "stun:" + stun_server
    }
  ]
};

export default {
  data() {
    return {
      view_share_video: null,
      local_stream: null,
      sharing_user_id: "no one",
      now_sharing: "no one",
      already_sharing: false,
      share_block: null,
      unloaded_img: null,
      sharing_img: null,
      sharing_possible: false,

      peer_connections: {}
    };
  },
  created() {
    this.socket.emit('viewsharejoin', {user_id: this.user.user_id, study_id: this.study_id})
    this.sharing_possible = navigator.mediaDevices ? true : false
  },
  props: ["socket", "user", "study_id", "connected_users"],
  watch: {
    sharing_user_id: function(change) {

      this.$emit("changeView", change);
      if (this.now_sharing == change) return;
      this.socket.emit("viewsharestart", {
        user_id: change,
        study_id: this.study_id
      });
    
    }
  },
  methods: {
    async get_stream(stream) {
      this.local_stream = stream;
    },

    sendMessage(message) {
      this.socket.emit("viewshare", message);
    },

    async getPeerConnection(user_id) {
      if (this.peer_connections[user_id]) {
        return this.peer_connections[user_id];
      }
      let t_pc = await new RTCPeerConnection(pcConfig);
      this.peer_connections[user_id] = t_pc;

      t_pc.onicecandidate = event => {
        if (event.candidate) {
          this.sendMessage({
            message: {
              type: "candidate",
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate
            },
            study_id: this.study_id,
            from: this.user.user_id,
            to: user_id
          });
        }
      };

      t_pc.onaddstream = event => {
        if (user_id != this.user.user_id) {
          this.share_block.childNodes[0].srcObject = event.stream;
          this.already_sharing = true;
        }
      };
      t_pc.addStream(this.local_stream);
      return t_pc;
    },

    createVideo() {
      let t_video = document.createElement("video");
      t_video.srcObject = null;
      t_video.style.width = "100%";
      t_video.style.position = "absolute";
      t_video.style.zIndex = 1;
      t_video.autoplay = true;
      t_video.playsinline = true;
      t_video.controls = true;

      return t_video;
    },

    createImg(i) {
      let t_img = document.createElement("img");
      t_img.src = i
        ? this.unloaded_img
        : this.sharing_img;
      t_img.style.position = "absolute";
      t_img.style.zIndex = 1;
      t_img.style.top = i ? "10%" :"30%"
      t_img.style.left = i ? "23%" : "30%"
      if (i != 0) {t_img.style.width = "50%"}
      return t_img;
    }
  },
  mounted() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = "1142"
    this.canvas.height = "653"
    
    this.unloaded_img = require("../../assets/images/no_sharing.png")
    this.sharing_img = require("../../assets/images/sharing.gif")
    this.share_block = document.getElementById("share_block");
    
    this.get_stream(this.canvas.captureStream(25))
    
    this.socket.on("viewsharestart", sharing_user_id => {
      for (let i in this.peer_connections) delete this.peer_connections[i];
      this.sharing_user_id = sharing_user_id;
      this.now_sharing = sharing_user_id;
      this.already_sharing = false;
      this.view_share_video = this.createVideo();
      this.share_block.removeChild(this.share_block.childNodes[0])
      if (sharing_user_id == "no one") {
        this.share_block.insertBefore(this.createImg(1), this.share_block.childNodes[0]);
        return;
      }
      this.user.user_id == sharing_user_id ? this.share_block.insertBefore(this.createImg(0), this.share_block.childNodes[0]) : this.share_block.insertBefore(this.view_share_video, this.share_block.childNodes[0])
      
      if (sharing_user_id == this.user.user_id) {
        navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
          } })
        .then(this.get_stream)
        .then(() => {
          for (let peer_id of this.connected_users) {
            if (peer_id == this.user.user_id) continue
            this.getPeerConnection(peer_id)
            .then(t_pc => {
              t_pc.createOffer(sdp => {
                t_pc.setLocalDescription(sdp) 
                this.sendMessage({
                  message: sdp,
                  study_id: this.study_id,
                  from: this.user.user_id,
                  to: peer_id
                })
              }, e => console.log(e))
            })
          }
        });
      }
    });

    this.socket.on("viewsharejoin", user_id => {

      if (this.user.user_id != this.now_sharing) return

      setTimeout(() => {
        this.getPeerConnection(user_id).then(t_pc => {
          t_pc.createOffer(
            sdp => {
              t_pc.setLocalDescription(sdp);
              this.sendMessage({
                message: sdp,
                study_id: this.study_id,
                from: this.user.user_id,
                to: user_id
              });
            }, e => console.log(e));
        });
      }, 1000);
    });

    this.socket.on("leave", data => {
      if (data.user_id == this.now_sharing) {
        this.share_block.removeChild(this.share_block.childNodes[0])
        this.sharing_user_id = "no one";
        this.share_block.insertBefore(this.createImg(1), this.share_block.childNodes[0]);
      }
    });

    this.socket.on("viewshare", data => {
      if (data.message.type === "offer") {
        this.view_share_video = this.createVideo();
        this.now_sharing = data.from;
        this.sharing_user_id = data.from;
        this.share_block.removeChild(this.share_block.childNodes[0])
        
        this.share_block.insertBefore(this.view_share_video, this.share_block.childNodes[0]);
        const from = data.from;
        this.getPeerConnection(from).then(t_pc => {
          t_pc.setRemoteDescription(new RTCSessionDescription(data.message));
          t_pc.createAnswer().then(sdp => {
            t_pc.setLocalDescription(sdp);
            this.sendMessage({
              message: sdp,
              study_id: this.study_id,
              from: this.user.user_id,
              to: from
            });
          });
        });
      } else if (data.message.type === "answer") {
        this.getPeerConnection(data.from).then(t_pc => {
          t_pc.setRemoteDescription(new RTCSessionDescription(data.message));
        });
      } else if (data.message.type === "candidate") {
        let candidate = new RTCIceCandidate({
          sdpMLineIndex: data.message.label,
          candidate: data.message.candidate
        });
        this.getPeerConnection(data.from).then(t_pc => {
          t_pc.addIceCandidate(candidate);
        });
      }
    });
  }
};
</script>

<style lang="stylus" scoped>
  #first {
    width: 50%;
    z-index : 1;
    position: absolute;
    left: 23%;
    top: 10%;
  }
  video {
    width: 100%;
    z-index : 1;
    position: absolute;
  }
  .btns {
    position: absolute;
    z-index : 5;
    left: 9px;
    top: 9px;
  }
</style>