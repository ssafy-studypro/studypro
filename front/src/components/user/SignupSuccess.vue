<template>
  <v-content id="signupSuccess">
      <v-card class="d-flex align-stretch mx-10 mb-3" min-height="50vh">
        <v-row align="center" justify="center">
          <v-col cols="9" class="text-center">
            <span class="display-2 font-weight-thin">Study</span>
            <span class="display-2">PRO</span>
            <p class="mt-5">회원가입 되었습니다!<br>로그인해주세요.</p>
            <v-btn text class="mr-4" color="primary" @click="signinModal = true">로그인</v-btn>
            <v-btn text color="error" to="/home">홈으로</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <signin-modal :signin-modal="signinModal" v-on:close="signinClose"/>
  </v-content>
</template>

<script>
export default {
  name: "signupSuccess",
  data: () => ({
    signinModal: false,
  }),
  components:{
    signinModal: () => import('@/components/user/SigninModal')
  },
  watch:{
    isAuth(){
      this.$router.push({name:'home'})
    }
  },
  computed:{
    isAuth(){
      return this.$store.getters['auth/isAuth']
    }
  },
  methods: {
    signinClose(){
      this.signinModal = false
    }
  },
};
</script>
