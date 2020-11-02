<template>
  <v-container v-if="isJoined" style="min-height: 500px">
    <v-list v-if="isCaptain">
      <v-toolbar elevation="0" style="border-bottom: 5px solid #736C70;">
        <v-toolbar-title>가입 요청 목록</v-toolbar-title>
      </v-toolbar>

      <v-list-item v-for="newbie in newbieList" :key="newbie.id">
        <v-row style="border-bottom: 1px solid #E5C1D4;">
          <v-col cols="1" align="center">
            <v-avatar size="40px" class="ma-0">
              <img :src="newbie.user.profile_url" />
            </v-avatar>
          </v-col>

          <v-col align="center" cols="2">
            <p style="font-size:14px" class="ma-0 pt-2">{{ newbie.user.nickname }}</p>
          </v-col>

          <v-col align="center" cols="1">
            <p
              style="font-size:14px"
              class="ma-0 pt-2"
            >{{ newbie.user.gender == "M" ? "남성" : "여성" }}</p>
          </v-col>

          <v-col align="center" cols="5">
            <p style="font-size:14px" class="ma-0 pt-2">{{ newbie.user.email }}</p>
          </v-col>

          <v-col align="center" cols="1">
            <v-icon
              @click="
                (modalType = 'greeting'),
                  (selectedUser = newbie),
                  (modal = true)
              "
              color="black"
            >more_horiz</v-icon>
          </v-col>

          <v-col align="center" cols="1">
            <v-icon
              @click="limit_check(newbie)"
              color="green"
            >check</v-icon>
          </v-col>

          <v-col align="center" cols="1">
            <v-icon
              @click="
                (modalType = 'decline'), (selectedUser = newbie), (modal = true)
              "
              color="red"
            >close</v-icon>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>

    <v-list>
      <v-toolbar elevation="0" style="border-bottom: 5px solid #736C70;">
        <v-toolbar-title>스터디 팀원</v-toolbar-title>
      </v-toolbar>

      <v-list-item v-for="member in memberList" :key="member.id">
        <v-row style="border-bottom: 1px solid #E5C1D4;">
          <v-col align-self="center" align="center" cols="1">
            <v-avatar size="40px" class="ma-0">
              <img :src="member.profile_url" />
            </v-avatar>
          </v-col>

          <v-col align-self="center" align="center" cols="2">
            <p style="font-size:14px" class="ma-0">{{ member.nickname }}</p>
          </v-col>

          <v-col align-self="center" align="center" cols="1">
            <p style="font-size:14px" class="ma-0">{{ member.gender == "M" ? "남성" : "여성" }}</p>
          </v-col>

          <v-col align-self="center" align="center" cols="4">
            <p style="font-size:14px" class="ma-0">{{ member.email }}</p>
          </v-col>

          <v-col align-self="center" align="center" cols="1">
            <a>
              <v-icon
                v-if="member.id !== currentUser.uid"
                class="black--text ma-0"
                @click="viewDetail(member)"
              >mdi-email</v-icon>
            </a>
          </v-col>

          <v-col align="center" cols="3">
            <v-row>
              <v-col cols="6">
                <v-img
                  v-if="member.level == 'captain'"
                  src="@/assets/images/crown.png"
                  height="30px"
                  width="30px"
                />

                <v-btn
                  v-else-if="member.level == 'gold'"
                  @click="changeLevel(member)"
                  fab
                  dark
                  color="orange"
                  height="30px"
                  width="30px"
                >
                  <v-icon style="font-size:20px" class="mb-2" dark>G</v-icon>
                </v-btn>

                <v-btn
                  v-else-if="member.level == 'silver'"
                  @click="changeLevel(member)"
                  fab
                  dark
                  color="grey"
                  height="30px"
                  width="30px"
                >
                  <v-icon style="font-size:20px" class="mb-2" dark>S</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-icon
                  v-if="isCaptain && member.level != 'captain'"
                  @click="
                    (modalType = 'delete'),
                      (selectedUser = member),
                      (modal = true)
                  "
                  color="red"
                >close</v-icon>

                <v-icon
                  v-else-if="
                    !isCaptain &&
                      member.level != 'captain' &&
                      member.id == currentUser.uid
                  "
                  style="font-size:15px"
                  @click="
                    (modalType = 'selfdel'),
                      (selectedUser = member),
                      (modal = true)
                  "
                  color="red"
                >탈퇴하기</v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-list-item>
      <template>
        <group-modal :group-modal="groupModal" :user="user" v-on:close="modalClose" />
      </template>

      <modal :open-modal="modal" :user="user" :close="modalClose">
        <template v-slot:text>
          <span v-if="modalType == 'delete'">{{ selectedUser.nickname }}</span>
          <span
            v-if="
              modalType != 'delete' &&
                modalType != 'error' &&
                modalType != 'selfdel' &&
                modalType != 'greeting'
            "
          >{{ selectedUser.user.nickname }}</span>
          {{ modalText[modalType] }}
          <p
            v-if="modalType == 'greeting'"
            class="mt-5 pt-2"
            style="white-space:pre;border-top: 1px solid #262F33;"
          >{{ selectedUser.comment }}</p>
        </template>
        <template v-slot:btn>
          <div class="text-end pr-3 pb-3">
            <v-btn text @click="acceptMember" class="primary--text" v-show="modalType == 'accept'">예</v-btn>
            <v-btn
              text
              @click="declineMember"
              class="primary--text"
              v-show="modalType == 'decline'"
            >예</v-btn>
            <v-btn text @click="deleteMember" class="primary--text" v-show="modalType == 'delete'">예</v-btn>

            <v-btn
              text
              @click="deleteMember"
              class="primary--text"
              v-show="modalType == 'selfdel'"
            >예</v-btn>

            <v-btn
              text
              @click="modal = false"
              class="error--text"
              v-show="modalType != 'error' && modalType != 'greeting'"
            >아니오</v-btn>
            <v-btn
              text
              @click="modal = false"
              class="error--text"
              v-show="modalType == 'error' || modalType == 'greeting'"
            >확인</v-btn>
          </div>
        </template>
      </modal>
    </v-list>
  </v-container>

  <v-container v-else style="min-height:400px">
    <v-row align="center" style="height:400px;">
      <v-col cols="12" class="text-center">
        <div>
          <span class="display-2 font-weight-thin">Study</span>
          <span class="display-2">PRO</span>
        </div>

        <div class="mt-4">
          <p>"{{ this.studyInfo.name }}" 스터디에 지금 가입하세요!</p>

          <v-btn v-if="!isApplying" text color="green lighten-2" @click="modalOpen">가입하기</v-btn>
          <span id="applying_span" v-else text color="blue lighten-2">가입 심사 중</span>

          <!-- <v-btn text color="error" @click="goBack">이전으로</v-btn> -->
        </div>
      </v-col>
    </v-row>

    <modal :open-modal="modal" v-on:close="modalClose">
      <template v-slot:toolbar v-if="reg_message == ''">
        <v-toolbar class="pa-0 customTheme white--text">가입신청</v-toolbar>
      </template>
      <template v-slot:text>
        <div v-show="reg_message == ''">
          <p>신청글</p>
          <v-textarea outlined hide-details v-model="comment"></v-textarea>
        </div>
        {{ reg_message }}
      </template>
      <template v-slot:btn>
        <div class="text-end pr-3 pb-3">
          <v-btn elevation="0" @click="regGroup" v-show="reg_message == ''">가입신청</v-btn>
          <v-btn elevation="0" @click="(modal = false)" v-show="reg_message != ''">확인</v-btn>
        </div>
      </template>
    </modal>
  </v-container>
</template>

<script>
import StudyService from "@/services/study.service";
import EmailService from "@/services/email.service";
import UserService from "@/services/user.service";

export default {
  props: ["study_id"],

  data: () => ({
    comment: "",
    reg_message: "",
    groupModal: false,
    user: "",
    modal: false,
    modalType: "",
    member: {},
    newbieList: [],
    memberList: [],
    studyInfo: {},
    isCaptain: false,
    isJoined: false,
    isApplying: false,

    selectedUser: {
      user: {
        nickname: ""
      }
    },
    modalText: {
      greeting: "가입인사",
      accept: "님의 가입 요청을 승인하시겠습니까?",
      decline: "님의 가입 요청을 거절하시겠습니까?",
      delete: "님을 탈퇴시키겠습니까?",
      selfdel: "정말로 탈퇴하시겠습니까?",
      error: "오류가 발생했습니다"
    }
  }),
  async mounted(){

    let apply_list = await StudyService.getApplyList({study_id :this.study_id});
    apply_list.data.forEach(element => {
      if(element.user_id === this.currentUser.uid){
        this.isApplying = true;
        return;
      }
    });

  },
  async created() {
    await this.loadStudyInfo();

    var res = await StudyService.getStudyInfo({ study_id: this.study_id }).then(
      res => {
        return res.data;
      }
    );
    if (res.level) {
      this.isJoined = true;
    } else {
      this.isJoined = false;
    }

    if (this.isCaptain) this.getApplyList();
    this.getjoinedUser();
  },

  watch: {
    studyInfo() {
      if (
        this.studyInfo &&
        this.currentUser &&
        this.currentUser.uid == this.studyInfo.captain
      ) {
        this.isCaptain = true;
      } else this.isCaptain = false;
    }
  },

  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    }
  },

  components: {
    modal: () => import("@/components/base/Modal"),
    GroupModal: () => import("@/components/user/messenger/MsgSendModal")
  },
  methods: {

    modalClose() {
      this.groupModal = false;
    },

    viewDetail(user) {
      this.groupModal = true;
      this.user = user;
    },

    async changeLevel(member) {
      if (!this.isCaptain) {
        window.alert("스터디장이 아닙니다");
        return;
      }
      const level = member.level === "silver" ? "gold" : "silver";
      await StudyService.changeUserLevel({
        study_id: this.study_id,
        user_id: member.id,
        level: level
      });
      location.reload();
    },
    getApplyList() {
      StudyService.getApplyList({ study_id: this.study_id }).then(
        newbieList => {
          this.newbieList = newbieList.data;
        }
      );
    },
    getjoinedUser() {
      StudyService.getjoinedUser({ study_id: this.study_id }).then(
        memberList => {
          this.memberList = memberList.data;
        }
      );
    },

    async loadStudyInfo() {
      this.studyInfo = await StudyService.getStudyInfo({
        study_id: this.study_id
      }).then(res => {
        return res.data;
      });
    },

    async acceptMember() {
      var res = await StudyService.joinStudy({
        apply_id: this.selectedUser.id,
        accept: true
      }).then(res => {
        return res.data;
      });
      if (res.state == "success") {
        this.getApplyList();
        this.getjoinedUser();
        this.modal = false;
        //이메일 보내기
        let user_email = this.selectedUser.user.email;

        let study_name = this.studyInfo.name;
        EmailService.resultApply(user_email, study_name, this.study_id, true);
      } else {
        this.modalType = "error";
      }
    },

    async declineMember() {
      var res = await StudyService.joinStudy({
        apply_id: this.selectedUser.id,
        accept: false
      }).then(res => {
        return res.data;
      });
      if (res.state == "success") {
        this.getApplyList();
        this.getjoinedUser();
        this.modal = false;

        //이메일 보내기
        let user_email = this.selectedUser.user.email;
        let study_name = this.studyInfo.name;
        EmailService.resultApply(user_email, study_name, this.study_id, false);
      } else {
        this.modalType = "error";
      }
    },
    async deleteMember() {
      var res = await StudyService.deleteUser({
        study_id: this.study_id,
        user_id: this.selectedUser.id
      }).then(res => {
        return res.data;
      });
      if (res.state == "success") {
        this.getApplyList();
        this.getjoinedUser();
        this.modal = false;
        let user_info = await UserService.getUserContent(this.selectedUser.id);
        let user_email = user_info.email;

        let study_name = this.studyInfo.name;
        EmailService.noticeDrop(user_email, study_name, this.study_id);
      } else {
        this.modalType = "error";
      }
    },

    async modalOpen() {
      this.comment = "";
      this.modal = true;
    },
 

    // clickBack() {
    //   this.$router.go(-1);
    // },

    async regGroup() {
      var payload = {
        study_id: this.study_id,
        comment: this.comment
      };

      var res = await StudyService.applyStudy(payload).then(res => {
        return res.data;
      });

      if (res.state == "success") {
        //이메일 보내기
        // let captain_info = await UserService.getUserContent(
        //   this.studyInfo.captain
        // );
        // let captain_email = captain_info.email;
        // let study_name = this.studyInfo.name;
        // EmailService.noticeApply(captain_email, study_name, this.study_id);

        this.reg_message = "가입신청을 완료했습니다";
        this.isApplying = true;

      } else {
        this.reg_message = res.data.detail;
      }
    },
    async limit_check(newbie) {
      let study_info = await StudyService.getStudyInfo({
        study_id: this.study_id
      });

      let study_limit = study_info.data.user_limit;
      let num_joined_student = study_info.data.num_joined_student;
      console.log(study_info);


      if (num_joined_student >= study_limit) {
        alert("스터디 참여 인원이 초과하였습니다.");
        return;
      }else{
        this.modalType = 'accept';
        this.selectedUser = newbie;
        this.modal = true;
      }
    }
  }
};
</script>

<style  scoped>
  #applying_span{
    color : #2196F3
  }
</style>