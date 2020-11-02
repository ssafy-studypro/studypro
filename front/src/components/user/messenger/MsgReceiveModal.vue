<template>
  <div id="groupmodal">
    <v-dialog v-model="open" max-width="40%">
      <v-card id="lgiModal" class="px-0 pt-0">
        <v-card-title class="customTheme darken-2 white--text pb-3">
          <span class="headline">[제목] {{ msg.title }}</span>
        </v-card-title>
        <v-card-text class="py-0 px-7">
          <v-container class="pb-0">
            <v-row class="justify-center">
              <v-avatar size="140" color="white">
                <v-img
                  v-if="tab === 'tx'"
                  :src="msg.to ? msg.to.profile_url : null"
                ></v-img>
                <v-img
                  v-if="tab === 'rx'"
                  :src="msg.from ? msg.from.profile_url : null"
                ></v-img>
                <!-- <v-icon size="140">mdi-account-circle</v-icon> -->
              </v-avatar>
            </v-row>
            <v-row class="py-4">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold">제목</v-content>
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">{{ msg.title }}</v-content>
              </v-col>
            </v-row>
            <hr />
            <v-row class="pt-4 pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >보낸 사람</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content v-if="tab === 'tx'" text class="py-0">{{
                  msg.to ? msg.to.nickname : null
                }}</v-content>
                <v-content v-if="tab === 'rx'" text class="py-0">{{
                  msg.from ? msg.from.nickname : null
                }}</v-content>
              </v-col>
            </v-row>
            <v-row class="py-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >보낸 시간</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{ msg.created_date ? msg.created_date.substr(0, 10) : null }}
                  {{ msg.created_date ? msg.created_date.substr(11, 5) : null }}
                </v-content>
              </v-col>
            </v-row>
            <hr />
            <v-row class="pt-3 pb-4">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >메시지 내용</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">{{ msg.content }}</v-content>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <div v-show="showResponse">
          <v-divider></v-divider>
          <v-row class="pt-6, ma-0">
            <v-col cols="12" class="pa-0">
              <v-textarea
                class="px-10"
                label="보낼 메시지"
                outlined
                single-line
                v-model="mainText"
                counter
                maxlength="100"
              ></v-textarea>
            </v-col>
          </v-row>
        </div>
        <v-card-actions class="pt-0 pr-5">
          <v-spacer></v-spacer>
          <v-btn
            color="error--text lighten-1 transparent"
            elevation="0"
            @click="clickExit"
            >닫기</v-btn
          >
          <div v-if="tab === 'rx'">
            <v-btn
              color="primary--text transparent"
              elevation="0"
              @click="clickResponse"
              v-if="!showResponse"
              >답장하기</v-btn
            >
            <v-btn
              color="primary--text transparent"
              elevation="0"
              @click="clickSend"
              v-else
              >보내기</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template>
      <check-modal
        :check-modal="checkModal"
        :to="to"
        :titleText="`[회신] ` + msg.title"
        :mainText="mainText"
        v-on:sendNo="sendNo"
        v-on:sendYes="sendYes"
      >
        reText=""
      </check-modal>
    </template>
  </div>
</template>
<script>
import AlarmService from "@/services/alarm.service";
export default {
  data: () => ({
    open: false,
    mainText: "",
    showResponse: false,
    checkModal: false
  }),
  props: ["groupModal", "gid", "msg", "tab"],
  watch: {
    groupModal() {
      this.open = this.groupModal;
    },
    open(op) {
      if (op == false) {
        this.showResponse = false;
        this.$emit("close");
      } else if (op == true && this.tab == "rx") {
        AlarmService.checkAlarm({ alarm_id: this.msg.id });
      }
    }
  },
  components: {
    CheckModal: () => import("@/components/user/messenger/CheckModal")
  },
  methods: {
    sendNo() {
      this.checkModal = false;
    },
    sendYes() {
      this.mainText = "";
      // this.checkModal = false;
      this.open = false;
    },

    clickResponse() {
      this.showResponse = true;
      this.$emit("clickRes");
    },
    clickExit() {
      this.mainText = "";
      this.open = false;
    },
    async clickSend() {
      //보내는 통신
      this.checkModal = true;
    }
  },
  computed: {
    to: function() {
      let toUser;
      if (this.tab === "tx") {
        toUser = this.msg.to ? this.msg.to.id : null;
      } else if (this.tab === "rx") {
        toUser = this.msg.from ? this.msg.from.id : null;
      }
      return toUser;
    }
  }
};
</script>
