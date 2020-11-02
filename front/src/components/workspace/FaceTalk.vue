<template>
  <v-card class="pa-0">
    <v-row no-gutters class="pa-0" border="0px">
      <v-col cols="12" md="6" class="d-none d-md-block" >
        <v-card height=130  outlined tile flex id="remote_block_0">
          <video :poster="user_profiles[0]" position="absolute" playsinline id="local_video" autoplay preload="metadata" width="100%" height="100%" @contextmenu="showProfileMenu($event, 0)"></video>
          <img class="mute" @click="mute($event)" :src="volume_img" alt="" id="mute_button_0">
          <img class="mute" @click="redrawing($event)" :src="camera_on_img" alt="" id="camera_button_0" style="right : 30px">
        </v-card>
      </v-col>
      <v-col v-for="i of [1,2,3,4,5]" :key="i" cols="12" md="6" class="d-none d-md-block" @contextmenu="showProfileMenu($event, i)">
        <v-card height=130 class="ma-0 pa-0" outlined tile flex  :id="`remote_block_${i}`">
          <img
          class="mt-6"
            src="../../assets/images/logo_gray.png"
            alt="펭수"
            width="70%"
            height="70%"
            id="pengsoo"
          />
        </v-card>
      </v-col>
    </v-row>
    <profile :user="user" :profile="profile" :show_profile_id="show_profile_id" @msgModal="msgModal"></profile>    
    <template>
      <group-modal
        :group-modal="groupModal"
        :user="msg_user"
        v-on:close="modalClose"
      />
    </template>
  </v-card>
</template>

<script>
import profile from './Profile'
const stun_server = "stun.l.google.com:19302";
const pcConfig = {
  iceServers: [
    {
      urls: "stun:" + stun_server
    }
  ]
};

export default {
  props: ["socket", "user", "study_id", "sharing_id", "debuging"],
  data() {
    return {
      groupModal: false,
      msg_user: {},

      // FaceTalk
      post_img: null,
      local_video: null,
      local_stream: null,

      local_dummy_stream: null,

      video_streamings: [true, true, true, true, true, true],
      video_mutes: [false, false, false, false, false, false],
      connected_users: [this.user.user_id, null, null, null, null, null],
      user_profiles: [null, null, null, null, null, null],
      peer_connections: {},

      remote_videos: [null],
      remote_streams: [null, null, null, null, null, null],
      show_profile_id: this.user.user_id,
      profile : {
        showProfile: false,
        x: 0,
        y: 0,
        items: [{ title: "Hello" }]
      }
    };
  },
  watch: {
    sharing_id: function(change_id, before_id) {
      
      const video_num = this.connected_users.indexOf(change_id)
      for (let i in this.connected_users) {
        i == video_num ? this.makeBorder(i) : this.deleteBorder(i, before_id)
      }
    }
  },
  components: {
    profile: profile,
    
    GroupModal: () => import("@/components/user/messenger/MsgSendModal")
  },
  methods: {
    modalClose() {
      this.groupModal = false;
    },
    msgModal(data) {
      this.groupModal = data.groupModal
      this.msg_user = data.msg_user
    },
    redrawing(e) {

      let temp_btn = e.target
      let i = temp_btn.id[14]

      if (i == 0) {
      
        if (this.video_streamings[i]) {
          this.local_video.srcObject = this.local_dummy_stream
        } else { 
          this.local_video.srcObject = this.local_stream
        }
        const delete_stream = this.video_streamings[i] ? this.local_stream : this.local_dummy_stream
        const add_stream = this.video_streamings[i] ? this.local_dummy_stream : this.local_stream
        this.video_streamings[i] = !this.video_streamings[i]
        temp_btn.src = this.video_streamings[i] ? this.camera_on_img : this.camera_off_img
        console.log('addstream', add_stream)
        console.log('delete', delete_stream)
        console.log('localstream', this.local_stream)
        console.log('---------------------------')
        for (let i in this.peer_connections) {
          let pc = this.peer_connections[i]
          pc.removeStream(delete_stream)
          pc.addStream(add_stream)
          pc.createOffer(sdp => {
            pc.setLocalDescription(sdp)
            this.sendMessage({
              message: sdp,
              study_id: this.study_id,
              from: this.user.user_id,
              to: i,
            })
          }, e=>{console.log(e)})
        }
      } else {
        const temp_stream = this.video_streamings[i] ? this.local_dummy_stream : this.remote_streams[i]
        this.remote_videos[i].firstChild.srcObject = temp_stream
        this.video_streamings[i] = !this.video_streamings[i]
        temp_btn.src = this.video_streamings[i] ? this.camera_on_img : this.camera_off_img
      }
    },

    mute(e) {
      let temp_btn = e.target
      let i = temp_btn.id[12]
      this.video_mutes[i] = !this.video_mutes[i]
      temp_btn.src = this.video_mutes[i] ? this.mute_img : this.volume_img
      this.remote_videos[i].childNodes[0].muted = this.video_mutes[i]
    },

    sendMessage(message) {
      this.socket.emit("message", message);
    },

    async get_stream(stream) {
      this.local_video = await document.getElementById("local_video");
      this.local_video.srcObject = stream;
      this.local_stream = stream;
    },

    showProfileMenu(e,i) {
      e.preventDefault();
      if (!this.connected_users[i]) return

      this.show_profile_id = this.connected_users[i]
      this.profile.showProfile = false;
      this.profile.x = e.clientX;
      this.profile.y = e.clientY;
      this.$nextTick(() => {
        this.profile.showProfile = true;
      });
    },

    async getPeerConnection(user_id) {
      let video_num,
        temp_null = 10,
        existed_num = null;
      for (let idx in this.connected_users) {
        if (this.connected_users[idx] == user_id) { existed_num = idx }
        else if (!this.connected_users[idx]) {
          temp_null = temp_null > idx ? idx : temp_null
        }
      }

      video_num = existed_num ? existed_num : temp_null;
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
        let remote_video = document.createElement("video");
        this.remote_streams[video_num] = event.stream;
        remote_video.playsinline = true
        remote_video.srcObject = this.remote_streams[video_num]
        remote_video.autoplay = true
        remote_video.style.width = "100%"
        remote_video.style.height = "100%"
        remote_video.style.zIndex = "1"
        remote_video.style.left = "0"
        remote_video.style.position = "absolute"
        remote_video.poster = this.user_profiles[video_num]
        
        const mute_button = document.createElement('img');
        mute_button.src = this.volume_img
        mute_button.id = `mute_button_${video_num}`
        mute_button.style.position = "absolute";
        mute_button.style.zIndex = "5";
        mute_button.style.width = "20px";
        mute_button.style.height = "20px";
        mute_button.style.right = '5px';
        mute_button.style.bottom = '5px';

        const camera_button = document.createElement('img')
        camera_button.src = this.camera_on_img
        camera_button.id = `camera_button_${video_num}`
        camera_button.style.position = "absolute";
        camera_button.style.zIndex = "5";
        camera_button.style.width = "20px";
        camera_button.style.height = "20px";
        camera_button.style.right = '30px';
        camera_button.style.bottom = '5px';


        const remote_block = this.remote_videos[video_num]
        while(remote_block.firstChild) remote_block.removeChild(remote_block.lastChild)
        remote_block.appendChild(remote_video)
        remote_block.appendChild(mute_button)
        remote_block.appendChild(camera_button)
        camera_button.onclick = this.redrawing
        mute_button.onclick = this.mute
      }

      t_pc.addStream(this.local_stream)

      return t_pc;
    },

    makeBorder(video_num) {    
      this.remote_videos[video_num].style.border = '3px'
      this.remote_videos[video_num].style.borderStyle = 'solid'
      this.remote_videos[video_num].style.borderColor = '#f4ff00'
      this.remote_videos[video_num].appendChild(this.createEye())
      this.remote_videos[video_num].lastChild.style.left = "25%"
      this.remote_videos[video_num].lastChild.style.top = "25%"
    },

    deleteBorder(video_num, before_id) {
      if (this.connected_users[video_num] !== before_id) return
      this.remote_videos[video_num].style.border = '0px'
      this.remote_videos[video_num].removeChild(this.remote_videos[video_num].lastChild)
    },

    createEye() {
      const eye = document.createElement('img')
      eye.src = require('../../assets/images/eye.png')
      eye.style.width = "50%"
      eye.style.position = "absolute"
      eye.style.zIndex = "3"
      eye.style.opacity = "0.4"

      return eye
    }
  },

  created() {
    this.mute_img = require("../../assets/images/mute.png")
    this.volume_img = require("../../assets/images/volume.png")
    this.camera_off_img = require("../../assets/images/camera_off.png")
    this.camera_on_img = require("../../assets/images/camera_on.png")
    this.no_signal_img = 'http://15.164.245.201:8000/images/profile_default.png'
    this.user_profiles[0] = this.user.user_profile_url
  },
  mounted() {

    for (let i = 1; i <= 5; i++) {
      this.remote_videos.push(document.getElementById(`remote_block_${i}`));
    }
    this.local_video = document.getElementById("local_video");
    this.remote_videos[0] = document.getElementById('remote_block_0')


    this.canvas = document.createElement('canvas')
    this.canvas.width = "172.85"
    this.canvas.height = "128.4"
    this.local_dummy_stream = this.canvas.captureStream(25)

    navigator.mediaDevices ? 
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(this.get_stream) :
      this.get_stream(this.canvas.captureStream(25))

    this.socket.on("join", message => {
      const user_id = message.user_id;
      if (user_id == this.user.user_id) return;
      for (let idx in this.connected_users) {
        if (!this.connected_users[idx]) {
          this.connected_users[idx] = user_id;
          break;
        }
      }
      this.$emit('connected', this.connected_users)
      setTimeout(() => {
        this.getPeerConnection(user_id)
        .then( t_pc => {
          t_pc.createOffer(sdp => {
            t_pc.setLocalDescription(sdp) 
            this.sendMessage({
              message: sdp,
              study_id: this.study_id,
              from: this.user.user_id,
              from_profile: this.user.user_profile_url || this.no_signal_img,
              to: user_id,
              isStreaming: this.video_streamings[0],
            })
          }, e => {console.log(e)})
        })      
      }, (1000));
    })

    this.socket.on('leave', message => {
      const video_num = this.connected_users.indexOf(message.user_id) === -1 ? this.connected_users.indexOf(`${message.user_id}`) : this.connected_users.indexOf(message.user_id)
      this.deleteBorder(video_num, this.sharing_id)
      this.connected_users[video_num] = null
      this.user_profiles[video_num] = null
      this.video_streamings[video_num] = true
      let temp_video =  this.remote_videos[video_num]

      while (temp_video.firstChild) temp_video.removeChild(temp_video.lastChild)

      const post_img = document.createElement('img')
      post_img.src = require("../../assets/images/logo_gray.png")
      post_img.className = "mt-6"
      post_img.style.width = "70%"
      post_img.style.height = "70%"

      this.remote_videos[video_num].appendChild(post_img)
      this.remote_streams[video_num] = null
      this.$emit('connected', this.connected_users)
      delete this.peer_connections[message.user_id]
    })

    this.socket.on("message", data => {
      if (data.message.type === "offer") {
        const from = data.from;

        for (let idx in this.connected_users) {
          if (!this.connected_users[idx]) {
            this.connected_users[idx] = from;
            this.user_profiles[idx] = data.from_profile
            this.video_streamings[idx] = data.isStreaming
            break;
          }
        }
        this.$emit('connected', this.connected_users)
        this.getPeerConnection(from).then(t_pc => {
          t_pc.setRemoteDescription(new RTCSessionDescription(data.message));
          t_pc.createAnswer().then(sdp => {
            t_pc.setLocalDescription(sdp);
            this.sendMessage({
              message: sdp,
              study_id: this.study_id,
              from: this.user.user_id,
              from_profile: this.user.user_profile_url,
              to: from
            });
          });
        });
      } else if (data.message.type === "answer") {
        this.user_profiles[this.connected_users.indexOf(data.from)] = data.from_profile
        let t_pc = this.peer_connections[data.from];
        t_pc.setRemoteDescription(new RTCSessionDescription(data.message));
      } else if (data.message.type === "candidate") {
        let candidate = new RTCIceCandidate({
          sdpMLineIndex: data.message.label,
          candidate: data.message.candidate
        });
        let t_pc = this.peer_connections[data.from];
        t_pc.addIceCandidate(candidate);
      }
    });
  }
};
</script>

<style scoped>
  .mute {
    width: 20px;
    height: 20px;
    position: absolute;
    z-index: 5;
    right: 5px;
    bottom: 5px;
  }
</style>