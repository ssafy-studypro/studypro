<template>
  <v-content id="signup" class="pa-0">
    <v-form ref="form" v-model="valid">
      <v-row justify="center">
        <v-col cols="12" md="11" lg="10">
          <v-card max-width="1000" class="mx-auto">
            <v-toolbar flat color="customTheme" dark>
              <v-row>
                <v-col class="py-0" offset="1">
                  <v-toolbar-title>회원가입</v-toolbar-title>
                </v-col>
              </v-row>
            </v-toolbar>
            <br />

            <v-row justify="center" align="center">
              <v-col cols="10">
                <v-text-field
                  v-model="id"
                  :rules="idRules"
                  label="아이디"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="10">
                <v-text-field
                  label="비밀번호"
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
                  label="비밀번호 확인"
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules.concat(passwordConfirmationRule)"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="10">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="이름"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="10">
                <v-select
                  v-model="genderinput"
                  :items="gender"
                  label="성별"
                  :rules="genderRules"
                  dense
                ></v-select>
              </v-col>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="10">
                <v-text-field
                  v-model="nickname"
                  :counter="10"
                  :rules="nicknameRules"
                  label="닉네임"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="10">
                <v-text-field
                  v-model="phone"
                  :rules="phoneRules"
                  label="휴대전화 번호( - 제외하고 입력해 주세요.)"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="10">
                <v-textarea
                  label="소개"
                  outlined
                  height="150px"
                  v-model="about"
                  single-line
                  :counter="50"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row justify="center">
              <image-input v-model="avatar" class="wrap-content" v-on:clear="imgClear">
                <div slot="activator" class="wrap-content">
                  <v-avatar
                    size="150px"
                    v-ripple
                    v-if="!avatar"
                    class="grey lighten-3 mb-3"
                  >
                    <img src="@/assets/images/profile_default.png" alt="avatar" />
                  </v-avatar>
                  <v-avatar size="150px" v-ripple v-else class="mb-3">
                    <img :src="avatar.imageURL" alt="avatar" />
                  </v-avatar>
                </div>
              </image-input>
            </v-row>
          </v-card>

          <!-- <v-row>
                  <v-col cols="12" sm="12">
                    <v-card class="px-5 mx-auto" max-width="1000">
                      <v-card-text class="pt-0" style="font-size:18px">
                        <p>
                          <br />
                        </p>
                        관심있는 분야를 선택해 주세요.
                      </v-card-text>

                      <v-row justify="center" align="center">
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="db"
                            class="mx-2"
                            label="데이터베이스"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="bc"
                            class="mx-2"
                            label="블록체인"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="al"
                            class="mx-2"
                            label="알고리즘"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="os"
                            class="mx-2"
                            label="운영체제"
                          ></v-checkbox>
                        </v-col>
                      </v-row>

                      <v-row justify="center" align="center">
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="ai"
                            class="mx-2"
                            label="인공지능"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="ad"
                            class="mx-2"
                            label="자율주행"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="cs"
                            class="mx-2"
                            label="컴퓨터보안"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox
                            v-model="cn"
                            class="mx-2"
                            label="컴퓨터통신"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row> -->

          <v-card
            class="mx-auto"
            max-width="1000"
            color="rgb(0, 0, 0, 0)"
            elevation="0"
          >
            <v-layout row right justify-end>
              <span
                class="red--text lighten-1 mr-10 pt-2 mt-2"
                v-show="notcreated"
                >아이디가 이미 존재합니다.</span
              >
              <v-btn
                class="mr-4 mt-2"
                :disabled="!valid || isLoading"
                color="green lighten-4"
                @click="onSignup()"
              >
                가입하기
              </v-btn>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-content>
</template>

<script>
export default {
  data: () => ({
    valid: true,

    id: "",
    idRules: [
      v => !!v || "아이디를 입력해 주세요.",
      v =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "ex) sample@example.com"
    ],

    password: "",
    confirmPassword: "",
    passwordRules: [
      v => !!v || "비밀번호를 입력해 주세요.",
      v =>
        (v && v.length >= 8) ||
        "문자 / 숫자 혼용 8자리 이상으로 만들어 주세요.",
      v =>
        /(?=.*[a-zA-Z])/.test(v) ||
        "문자 / 숫자 혼용 8자리 이상으로 만들어 주세요.",
      v =>
        /(?=.*\d)/.test(v) || "문자 / 숫자 혼용 8자리 이상으로 만들어 주세요."
    ],
    confirmPasswordRules: [v => !!v || "비밀번호를 한 번 더 입력해 주세요."],
    about: "",

    name: "",
    nameRules: [
      v => !!v || "이름을 입력해 주세요.",
      v => (v && v.length <= 45) || "이름이 너무 깁니다."
    ],

    gender: ["남성", "여성"],
    genderRules: [v => !!v || "성별을 선택해 주세요."],
    genderinput: "",

    nickname: "",
    nicknameRules: [
      v => !!v || "닉네임을 입력해 주세요.",
      v => (v && v.length <= 10) || "닉네임은 최대 10자입니다."
    ],

    phone: "",
    phoneRules: [
      v => !!v || "휴대전화 번호를 입력해 주세요.",
      v =>
        (v && v.length >= 10 && v.length <= 11) ||
        "전화번호 형식이 올바르지 않습니다.",
      v =>
        !/(?=.*[a-zA-Z!@#$%^&*()_+=-?/'";{}])/.test(v) ||
        "전화번호 형식이 올바르지 않습니다."
    ],

    ai: false,
    bc: false,
    al: false,
    ad: false,
    os: false,
    db: false,
    cn: false,
    cs: false,
    notcreated: false,
    avatar: null,
    isLoading: false
  }),
  watch: {
    password() {
      this.confirmPassword = "";
    }
  },
  components: {
    ImageInput: () => import("@/components/base/ImageInput")
  },
  methods: {
    async onSignup() {
      try {
        let formData = new FormData();
        formData.append("email", this.id);
        formData.append("password", this.password);
        formData.append("name", this.name);
        formData.append("nickname", this.nickname);
        formData.append("gender", this.genderinput == "남성" ? "M" : "W");
        formData.append("phone", this.phone);
        formData.append("about", this.about);
        if (this.avatar) {
          formData.append("img", this.avatar.imageFile);
        } else {
          formData.append("img", null);
        }
        await this.$store.dispatch("auth/register", formData).then(state => {
          if (state) {
            this.$router.push({ path: "/user/signup/success" });
          } else {
            this.notcreated = true;
          }
        });
        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },

    imgInit() {
      this.avatar = null;
    },

    imgClear(){
      this.avatar = null
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
    if (this.$store.getters["auth/isAuth"]) {
      this.$router.push({ name: "home" });
    }

    this.id = "";
    this.password = "";
    this.confirmPassword = "";
    this.name = "";
    this.nickname = "";
    this.phone = "";
    this.genderinput = "";
    this.about = "";
    this.avatar = null;
  }
};
</script>
