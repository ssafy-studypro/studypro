<template>
  <div>
    <v-card class="mb-2">
      <v-btn
        height="70"
        class="btns_room primary mb-4"
        large
        @click="toWorkspace"
        block
      >
        <v-icon color="white" class="mr-2">exit_to_app</v-icon>스터디룸
      </v-btn>
    </v-card>
    <v-card outlined class="mx-auto mb-2" width="600">
      <v-card flat>
        <v-img :src="study_info.image_url" max-height="150px"></v-img>
      </v-card>
      <v-divider class="mx-2" />
      <v-card-title>
        <span class="Hline">{{ study_info.name }}</span>
      </v-card-title>
      <v-card-subtitle class="gray--text pt-1 pl-7">
        <span>{{ study_info.goal }}</span>
      </v-card-subtitle>
      <v-card-subtitle class="black--text">
        <span class="subline">
          소개말
          <br />
        </span>
        <span class="subtxt pl-2">{{ study_info.description }}</span>
      </v-card-subtitle>
      <v-divider class="mx-2" />
      <v-card-actions class="mb-2">
        <v-row class="mx-0">
          <template v-if="isJoined">
            <v-btn
              v-if="!attendenced"
              class="btns_join primary mt-1"
              large
              @click="attendence"
              block
              >출석 체크</v-btn
            >
            <v-btn v-else class="btns_join mt-1" disabled large block
              >출석 완료</v-btn
            >
          </template>
          <template v-else>
            <v-btn
              v-if="!isApplying"
              class="btns_join green mt-1"
              large
              dark
              @click="modalOpen"
              block
              >가입하기</v-btn
            >
            <v-btn v-else class="btns_join mt-1" disabled large block
              >가입 심사 중</v-btn
            >
          </template>
          <v-btn
            v-if="currentUser.uid == study_info.captain"
            class="btns_join error mt-2"
            @click="(deleteType = 'question'), (deleteModal = true)"
            large
            block
            >스터디 해체</v-btn
          >
        </v-row>
      </v-card-actions>
    </v-card>
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
        <div class="text-end pr-3 pb-3 pt-5">
          <v-btn elevation="0" @click="regGroup" v-show="reg_message == ''"
            >가입신청</v-btn
          >
          <v-btn elevation="0" @click="modalClose" v-show="reg_message != ''"
            >확인</v-btn
          >
        </div>
      </template>
    </modal>
    <modal :open-modal="deleteModal" v-on:close="deleteModal = false">
      <template v-slot:text>
        <span v-show="deleteType == 'question'"
          >정말 모임을 해체하시겠습니까?</span
        >
        <span v-show="deleteType == 'confirm'"
          >모임이 해체되었습니다<br />메인페이지로 이동하겠습니다</span
        >
      </template>
      <template v-slot:btn>
        <div class="text-end pr-3 pb-3">
          <v-btn
            v-show="deleteType == 'question'"
            class="error"
            text
            @click="destroyStudy"
            >확인</v-btn
          >
          <v-btn
            v-show="deleteType == 'question'"
            text
            @click="(deleteType = 'question'), (deleteModal = false)"
            >취소</v-btn
          >
          <v-btn v-show="deleteType == 'confirm'" text @click="moveHome"
            >확인</v-btn
          >
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import StudyService from "@/services/study.service";
import UserService from "@/services/user.service";
import EmailService from "@/services/email.service";

export default {
  props: ["study_id"],
  data() {
    return {
      study_info: [],
      modal: false,
      comment: "",
      reg_message: "",
      isJoined: false,
      attendenced: false,
      isApplying: "",
      deleteModal: false,
      deleteType: "question"
    };
  },

  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    }
  },
  components: {
    modal: () => import("@/components/base/Modal")
  },
  async created() {
    await this.getStudyInfo();
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
  },

  methods: {
    async getStudyInfo() {
      const tmp = await StudyService.getStudyInfo({
        study_id: this.study_id
      });
      this.study_info = tmp.data;
    },

    async regGroup() {
      var payload = {
        study_id: this.study_id,
        comment: this.comment
      };

      var res = await StudyService.applyStudy(payload).then(res => {
        return res.data;
      });

      if (res.state == "success") {
        this.reg_message = "가입신청을 완료했습니다";
        let captain_info = await UserService.getUserContent(
          this.study_info.captain
        );
        let captain_email = captain_info.email;
        let study_name = this.study_info.name;
        EmailService.noticeApply(captain_email, study_name, this.study_id);
      } else {
        this.reg_message = res.data.detail;
      }
    },

    modalOpen() {
      this.comment = "";
      this.modal = true;
    },

    modalClose() {
      this.reg_message = "";
      this.modal = false;
    },
    getCurrentDate() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; //January is 0!
      let yyyy = today.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }

      return (today = yyyy + "-" + mm + "-" + dd);
    },

    async attendence() {
      let payload = {
        study_id: this.study_id,
        user_id: this.$store.getters["auth/getUser"].uid
      };

      let result = await StudyService.attendence(payload);

      if (result.data.state === "success") {
        alert("출석 하셨습니다.");
        this.attendenced = true;
      } else if (result.data.state === "fail") {
        alert("출석에 실패했습니다.");
      }
    },

    async check_attendence() {
      let payload = {
        study_id: this.study_id,
        user_id: this.$store.getters["auth/getUser"].uid,
        date: this.getCurrentDate()
      };
      let result = await StudyService.checkAttendence(payload);
      return result;
    },

    toWorkspace() {
      this.$emit("toWorkspace");
    },

    async destroyStudy() {
      console.log('des')
      let payload = {
        study_id: this.study_info.id,
        user_id: this.currentUser.uid
      };
      let res = StudyService.destroyStudy(payload);
      if(res.state == 'success'){
        this.deleteType = 'confirm'
      }

    },

    moveHome() {
      this.deleteModal = false;
      this.$router.push({ name: "home" });
    }
  },
  async mounted() {
    this.check_attendence().then(res => {
      if (res.data.state === "true") {
        this.attendenced = true;
      } else if (res.data.state === "false") {
        this.attendenced = false;
      }
    });

    let apply_list = await StudyService.getApplyList({
      study_id: this.study_id
    });
    let user_id = this.$store.getters["auth/getUser"].uid;
    apply_list.data.forEach(element => {
      if (element.user_id === user_id) {
        this.isApplying = true;
        return;
      }
    });
  }
};
</script>

<style scoped>
.btns_room {
  font-size: 27px !important;
}
.btns_join {
  font-size: 20px !important;
}
.Hline {
  font-size: 25px !important;
  font-weight: bold !important;
}
.subline {
  font-size: 18px !important;
}
.subtxt {
  font-size: 15px !important;
  color: #808080 !important;
}
</style>
