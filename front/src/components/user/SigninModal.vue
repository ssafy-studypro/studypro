<template>
  <v-dialog v-model="open" max-width="500px">
    <v-card id="entireBox" class="px-0 pt-0">
      <v-card-title class="customTheme darken-2 white--text pb-3">
        <span class="headline">로그인</span>
      </v-card-title>
      <v-card-text class="py-0 px-7">
        <v-container class="pb-0">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field
                required
                type="email"
                :rules="idRules"
                v-model="user.email"
                @keyup.enter="clickEnter"
              >
                <template v-slot:label>
                  <strong>
                    <v-icon style="vertical-align: middle">email</v-icon>
                  </strong>
                  E-mail
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                required
                :rules="passwordRules"
                type="password"
                v-model="user.password"
                @keyup.enter="clickEnter"
              >
                <template v-slot:label>
                  <strong>
                    <v-icon style="vertical-align: middle">lock</v-icon>
                  </strong>
                  Password
                </template>
              </v-text-field>
            </v-col>
            <v-col class="pa-0 pl-4">
              <a id="kakao-login-btn"></a>
              <button
                class="social-btn mr-4 mt-1"
                @click="AuthKakaoSignin('kakao')"
              >
                <v-img
                  src="https://developers.kakao.com/assets/img/about/logos/kakaologin/kr/kakao_account_login_btn_medium_narrow.png"
                ></v-img>
              </button>
            </v-col>
            <v-checkbox
              id="modalCheckbox"
              class="py-0 mb-0"
              v-model="user.loginRemain"
              label="로그인 상태 유지"
              color="primary"
              value="primary"
              hide-details
            ></v-checkbox>
          </v-row>
        </v-container>
      </v-card-text>
      <div class="form-group">
        <div class="red--text text-center" v-if="message">{{ message }}</div>
      </div>
      <v-card-actions class="pt-0 pr-5">
        <v-spacer></v-spacer>
        <v-btn
          color="error--text lighten-1 transparent"
          @click="close"
          elevation="0"
          >닫기</v-btn
        >
        <v-btn
          color="transparent"
          @click.prevent="signin"
          elevation="0"
          :disabled="isLoading"
        >
          <span class="spinner-border spinner-border-sm"></span>
          <span>로그인</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import WbKakao from "@/social-signin/kakao/kakao";

export default {
  data: () => ({
    user: {
      email: "",
      password: "",
      loginRemain: false,
    },
    open: false,
    isLoading: false,
    message: "",
    idRules: [(v) => !!v || "아이디를 입력해 주세요."],
    passwordRules: [(v) => !!v || "비밀번호를   입력해 주세요."],
  }),
  props: ["signinModal"],
  watch: {
    signinModal() {
      this.open = this.signinModal;
    },
    open() {
      if (!this.open) {
        this.close();
      }
    },
  },
  methods: {
    close() {
      this.user = {
        email: "",
        password: "",
        loginRemain: false,
      };
      this.$emit("close");
    },

    async signin() {
      this.isLoading = true;
      if (this.user.email && this.user.password) {
        await this.$store.dispatch("auth/login", this.user).then(
          (res) => {
            if (res) {
              this.close();
            } else {
              this.message = "아이디 또는 비밀번호를 잘못입력했습니다.";
            }
          },
          (error) => {
            this.message = error.message;
          }
        );
      } else if (!this.user.email) {
        this.message = "아이디를 입력해주세요";
      } else {
        this.message = "비밀번호를 입력해주세요";
      }

      this.isLoading = false;
    },
    async AuthKakaoSignin() {
      const user_info = await WbKakao.signinForm();
      let {
        properties: { nickname, profile_image },
        kakao_account: { email, gender },
      } = user_info;
      console.log(user_info);
      try {
        gender = gender === "male" ? "M" : "F";
        await this.$store.dispatch("auth/socialLogin", {
          email,
          nickname,
          gender,
          profile_image,
          platform: "kakao",
        });
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    clickEnter() {
      this.signin();
    },
  },
  mounted() {
    if (this.$store.getters["auth/isAuth"]) {
      this.$emit("close");
    }
  },
};
</script>

<style>
#entireBox {
  opacity: 0.9;
}
.social-btn {
  outline: none;
}
</style>
