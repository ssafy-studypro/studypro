<template>
  <v-container id="requestsignin" style="min-height:400px">
    <v-row align="center" style="height:400px;">
      <v-col cols="12" class="text-center">
        <div>
          <v-img src="@/assets/images/LogoText7.png" contain style="max-height:80px;"></v-img>
        </div>
        <div class="mt-4">
          <slot name="text"></slot>
          <v-btn text class="mr-4" color="primary" @click="signinModal = true">로그인</v-btn>
          <v-btn text color="green lighten-2" @click="moveSignup">회원가입</v-btn>
          <v-btn text color="error" @click="goBack">이전으로</v-btn>
        </div>
      </v-col>
    </v-row>
    <signin-modal :signin-modal="signinModal" v-on:close="signinClose" />
  </v-container>
</template>

<script>
export default {
  name: "requestsignin",
  data: () => ({
    signinModal: false
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
