<template>
  <v-container>
    <v-card outlined class="pt-1 px-0">
      <v-card  height="286" class="chat overflow-y-auto mx-1 pa-2" outlined autofocus style="background-color: #e9e9e9">
        <v-list class="ma-0 pa-0" ref="chat" outlined v-for="(data, index) in messages" :key="index" :align="'나' === data[0] ? `right` : data[0] ? `left` : 'center'" style="background-color: #e9e9e9">
          <font style="display : block" size="2">{{ data[0] === '나' ? '' : data[0] }}</font>
            <font>
              <div v-for="(message,in_index) in data[1]" :key="`${index}-${in_index}`">
              <span display="inline-block" class="chat" :style="data[0] === '나' ? 'background-color: #fef01b' : data[0] ? 'background-color: #ffffff' : 'background-color: #e9e9e9'"  size="2">
              {{message}}
              </span>
              </div>
            </font>
        </v-list>
      </v-card>
      <v-text-field
        class="mt-3 mb-2 ml-1"
        outlined
        dense
        v-model="message"
        append-outer-icon="mdi-send"
        clear-icon="mdi-close-circle"
        clearable
        hide-details
        label="전송할 메세지를 입력하세요."
        type="text"
        @click:append-outer="sendMessage"
        @click:prepend="changeIcon"
        @click:clear="clearMessage"
        @keyup.esc="clearMessage"
        @keyup.enter="sendMessage"
      ></v-text-field>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ["socket", "user", "study_id"],
  data() {
    return {
      name: this.user.user_nickname,
      prvUsr: "",
      index: 0,
      message: "",
      messages: [],
      length: 0,
    };
  },
  methods: {
    sendMessage() {
      if (this.message.length === 0) return;
      this.socket.emit("send message", {
        user_nickname: this.user.user_nickname,
        message: this.message,
        study_id: this.study_id
      });
      this.resetIcon();
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? (this.iconIndex = 0)
        : this.iconIndex++;
    }
  },
  computed: {
    icon() {
      return this.icons[this.iconIndex];
    }
  },
  updated() {
    var chat = document.querySelector(".chat");
    chat.scrollTop = chat.scrollHeight;
  },
  mounted() {
    this.socket.on("receive message", data => {
      data.user_nickname = data.user_nickname === this.user.user_nickname ? '나' : data.user_nickname
      let tmp = data.user_nickname;
      if (data.user_nickname === this.prvUsr) {
        this.messages[this.length - 1][1].push(data.message)
        return
      }
      this.prvUsr = tmp;
      this.length = this.messages.push([data.user_nickname, [data.message]])
    });
    this.socket.on("join", data => {
      this.prvUsr = '공지'
      const message = data.user_id == this.user.user_id ? '스터디룸에 입장하였습니다' : `${data.user_nickname} 님이 입장하였습니다`
      this.messages.push(['', [message]])
    })
    this.socket.on("leave", data => {
      this.prvUsr = '공지'
      const message = data.user_id == this.user.user_id ? '스터디룸을 나갔습니다' : `${data.user_nickname} 님이 퇴장하였습니다`
      this.messages.push(['', [message]])
    })
  }
};
</script>

<style scoped>
  span {
    display: inline-block;
    border-radius: 5px;
    font-family: 'MapoPeacefull';
    /* font-weight: bolder; */
    font-size: 14px;
  }
  .chat {
    margin-top: 5px;
    padding: 4px 6px 4px 6px;
  }
</style>