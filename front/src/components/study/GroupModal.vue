<template>
  <div id="groupmodal">
    <v-dialog v-model="open" max-width="700px">
      <v-card v-if="studyInfo" id="lgiModal" class="px-0 pt-0">
        <v-card-title class="customTheme darken-2 white--text pb-3">
          <span class="headline">{{ studyInfo.name }}</span>
        </v-card-title>
        <v-card-text class="py-0 px-7">
          <v-container class="pb-0">
            <v-row class="justify-center" id="img-container">
              <v-img id="study-img" :src="studyInfo.image_url" contain></v-img>
            </v-row>
            <v-row class="pt-4 pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >카테고리</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{ studyInfo.minor_class.name }}
                </v-content>
              </v-col>
            </v-row>
            <v-row class="pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold">상태</v-content>
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">{{ studyInfo.status }}</v-content>
              </v-col>
            </v-row>
            <v-row class="pb-4">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >멤버 수</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{ studyInfo.num_joined_student }}/{{
                    studyInfo.user_limit == 0 ? "-" : studyInfo.user_limit
                  }}
                </v-content>
              </v-col>
            </v-row>
            <hr />
            <v-row class="pt-4 pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >스터디명</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">{{ studyInfo.name }}</v-content>
              </v-col>
            </v-row>
            <v-row class="pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >스터디 목표</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">{{ studyInfo.goal }}</v-content>
              </v-col>
            </v-row>
            <v-row class="pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >스터디 소개</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{
                    studyInfo.description == "" ? "-" : studyInfo.description
                  }}
                </v-content>
              </v-col>
            </v-row>
            <v-row class="pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >시작날짜</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{ studyInfo.start_date }}
                </v-content>
              </v-col>
            </v-row>
            <v-row class="pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >종료날짜</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{ studyInfo.end_date }}
                </v-content>
              </v-col>
            </v-row>
            <v-row class="pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold">시간</v-content>
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{ studyInfo.start_time | getTime }} ~
                  {{ studyInfo.end_time | getTime }}
                </v-content>
              </v-col>
            </v-row>
            <v-row class="pb-4">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold">요일</v-content>
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{ studyInfo.process_days | getDays }}
                </v-content>
              </v-col>
            </v-row>
            <hr />

            <v-row class="pt-4 pb-1">
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold">그룹장</v-content>
              </v-col>
              <v-col class="py-0" @click="sendMsg(studyInfo.captain)">
                <v-content text class="py-0">
                  {{ studyInfo.captain.nickname }}
                  <a>
                    <v-icon class="primary--text">mdi-email</v-icon>
                  </a>
                </v-content>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3" class="py-0">
                <v-content text class="py-0 font-weight-bold"
                  >그룹장 소개글</v-content
                >
              </v-col>
              <v-col class="py-0">
                <v-content text class="py-0">
                  {{
                    studyInfo.captain.about == "null"
                      ? "-"
                      : studyInfo.captain.about
                  }}
                </v-content>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-3 pr-5">
          <v-spacer></v-spacer>
          <v-btn
            color="error--text lighten-1 transparent"
            elevation="0"
            @click="open = false"
            >close</v-btn
          >
          <v-btn
            color="primary--text transparent"
            elevation="0"
            @click="regGroup"
            >{{
              studyInfo.membership_level ? "스터디로 가기" : "가입하러가기"
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template>
      <SendMsgModal v-if="studyInfo !=null"
        :group-modal="msgOpen"
        :user="studyInfo.captain"
        v-on:close="SendMsgModalClose"
      />
    </template>
    <template>
      <LoginChkModal :openModal="loginChkOpen" v-on:close="LoginChkModalClose">
        <template v-slot:text>
          <span>로그인이 필요한 기능입니다.</span>
        </template>
      </LoginChkModal>
    </template>
  </div>
</template>

<script>
export default {
  name: "groupmodal",
  data: () => ({
    greetComment: "",
    msgOpen: false,
    loginChkOpen: false,
    open: false,
    captain: {}
  }),
  props: ["groupModal", "studyInfo"],
  components: {
    SendMsgModal: () => import("@/components/user/messenger/MsgSendModal"),
    LoginChkModal: () => import("@/components/base/Modal")
  },
  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    }
  },
  watch: {
    groupModal() {
      this.open = this.groupModal;
    },
    open() {
      if (!this.open) {
        this.$emit("close");
      }
    }
  },
  methods: {
    regGroup() {
      this.$router.push({
        name: "study_home",
        params: { study_id: this.studyInfo.id }
      });
    },
    sendMsg(captain) {
      if (this.isAuth) {
        this.captain = captain;
        this.msgOpen = true;
      } else {
        this.loginChkOpen = true;
      }
    },
    SendMsgModalClose() {
      this.msgOpen = false;
    },
    LoginChkModalClose() {
      this.loginChkOpen = false;
    }
  },
  filters: {
    getTime(value) {
      var hour = Math.floor(value / 100);
      var minute = value % 100;
      if (hour < 10) hour = "0" + hour;
      if (minute < 10) minute = "0" + minute;

      return hour + ":" + minute;
    },
    getDays(value) {
      if (!value) return;
      if (value.length == 1 && value[0].day == "") {
        return "";
      }
      var days = "";
      var weekofdays = {
        Mon: "월",
        Tue: "화",
        Wed: "수",
        Thu: "목",
        Fri: "금",
        Sat: "토",
        Sun: "일"
      };
      for (var i = 0; i < value.length; i++) {
        days += weekofdays[value[i].day] + " ";
      }

      if (days == "undefined ") return "미정";
      return days;
    }
  }
};
</script>

<style>
#img-container {
  height: 200px;
}

#study-img {
  height: 100%;
  width: auto;
}
</style>
