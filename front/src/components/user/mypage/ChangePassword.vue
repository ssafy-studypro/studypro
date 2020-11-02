<template>
  <v-form>
    <v-container>
      <div id="app">
        <v-app id="inspire">
          <v-form ref="form" v-model="valid">
            <v-card class="mx-auto" elevation="0">
              <br />

              <v-row justify="center" align="center"
                ><v-col cols="10">
                  <v-text-field
                    label="현재 비밀번호"
                    v-model="curpassword"
                    :rules="curpasswordRules"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row justify="center" align="center"
                ><v-col cols="10">
                  <v-text-field
                    label="새 비밀번호"
                    v-model="password"
                    :rules="passwordRules"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row justify="center" align="center">
                <v-col cols="10">
                  <v-text-field
                    label="새 비밀번호 확인"
                    v-model="confirmPassword"
                    :rules="
                      confirmPasswordRules.concat(passwordConfirmationRule)
                    "
                    type="password"
                    required
                  ></v-text-field> </v-col
              ></v-row>
              <v-row justify="end">
                <span class="error--text subtitle-1 mr-5 pt-2">{{message}}</span>
                <v-btn
                  class="mr-6 mb-2"
                  :disabled="!valid"
                  color="success"
                  @click="changePass"
                >
                  변경하기
                </v-btn>
              </v-row>
            </v-card>
          </v-form>
        </v-app>
      </div>
    </v-container>
    <v-dialog v-model="modalOpen" max-width="300px" :scrollable="false">
      <v-card>
        <v-card-title>비밀번호 변경완료</v-card-title>
        <v-card-text>
          <v-row justify="end">
        <v-btn text @click="modalOpen = false">
          <span>확인</span>
        </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    pwd: "qwerqwer1",
    valid: true,

    curpassword: "",
    password: "",
    confirmPassword: "",
    curpasswordRules: [],
    passwordRules: [],
    confirmPasswordRules: [v => !!v || "비밀번호를 한 번 더 입력해 주세요."],
    message: '',
    modalOpen: false,
  }),

  methods: {
    async changePass() {
      try {
        var formData = new FormData();
        formData.append("password", this.curpassword);
        formData.append("new_password", this.password);

        var res = await this.$store.dispatch("changePass", formData);
        if(res.state == 'success'){
          this.curpassword = ''
          this.password = ''
          this.message = ''
          this.modalOpen = true;
        }else{
          this.message = '비밀번호를 변경하지 못했습니다.'
        }
      } catch (err) {
        console.error(err);
      }
    }
  },
  watch: {
    password() {
      this.confirmPassword = "";
    }
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.confirmPassword ||
        "비밀번호가 서로 일치하지 않습니다.";
    }
  },
  mounted() {
    this.passwordRules = [
      v => !!v || "새 비밀번호를 입력해 주세요.",
      v =>
        (v && v.length >= 8) ||
        "문자 / 숫자 혼용 8자리 이상으로 만들어 주세요.",
      v =>
        /(?=.*[a-zA-Z])/.test(v) ||
        "문자 / 숫자 혼용 8자리 이상으로 만들어 주세요.",
      v =>
        /(?=.*\d)/.test(v) || "문자 / 숫자 혼용 8자리 이상으로 만들어 주세요.",
      v => (v && v !== this.pwd) || "기존 비밀번호와 동일합니다."
    ];
    this.curpasswordRules = [v => !!v || "현재 비밀번호를 입력해 주세요."];
  }
};
</script>
