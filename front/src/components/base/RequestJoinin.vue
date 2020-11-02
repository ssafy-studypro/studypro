<template>
  <v-container id="requestsignin" style="min-height:400px">
    <v-row align="center" style="height:400px;">
      <v-col cols="12" class="text-center">
        <div>
          <span class="display-2 font-weight-thin">Study</span>
          <span class="display-2">PRO</span>
        </div>
        <div class="mt-4">
          <p>"{{ this.studyInfo.name }}" 스터디에 지금 가입하세요!</p>
          <v-btn text color="green lighten-2" @click="modalOpen">가입하기</v-btn>
          <v-btn text color="error" @click="goBack">이전으로</v-btn>
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
          <v-btn elevation="0" @click="regGroup" v-show="reg_message == ''"
            >가입신청</v-btn
          >
          <v-btn elevation="0" @click="modalClose" v-show="reg_message != ''"
            >확인</v-btn
          >
        </div>
      </template>
    </modal>






  </v-container>
</template>

<script>
export default {

    props: ["study_id"],



  data: () => ({
    modal: false,
    comment: "",
    reg_message: "",



  }),
  components: {
    signinModal: () => import("@/components/user/SigninModal")
  },
  methods: {
    signinClose() {
      this.signinModal = false;
    },
    moveSignup() {
      this.$router.push({ name: "signup" });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  mounted() {
    if (this.$store.getters["auth/isAuth"]) {
      this.$router.push({ name: "home" });
    }
  }
};
</script>
