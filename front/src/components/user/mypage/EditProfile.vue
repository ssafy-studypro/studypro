<template>
  <v-form>
    <v-container>
      <div id="app">
        <v-app id="inspire">
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" sm="12">
                <v-card class="mx-auto" elevation="0">
                  <v-row justify="center" align="center">
                    <v-col cols="10">
                      <v-text-field
                        :disabled="true"
                        v-model="email"
                        label="아이디"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="10">
                      <v-text-field
                        v-model="name"
                        label="이름"
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="10">
                      <v-select
                        v-model="gender"
                        :items="genderItems"
                        label="성별"
                        dense
                        disabled
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="10">
                      <v-text-field
                        v-model="nickname"
                        :counter="10"
                        label="닉네임"
                        :rules="nicknameRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="10">
                      <v-text-field
                        v-model="phone"
                        label="휴대전화 번호( - 제외하고 입력해 주세요.)"
                        :rules="phoneRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="10">
                      <v-textarea
                        v-model="about"
                        :counter="150"
                        label="자신을 멋지게 소개해 주세요!"
                        outlined
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
                          <img :src="profile_url" />
                        </v-avatar>
                        <v-avatar size="150px" v-ripple v-else class="mb-3">
                          <img :src="avatar.imageURL" alt="avatar" />
                        </v-avatar>
                      </div>
                    </image-input>
                  </v-row>
                  <v-row justify="end">
                    <v-col class="justify-end">
                      <span class="error--text mr-5 subtitle-1 pt-1">{{ message }}</span>
                      <v-btn
                        :disabled="!enablebtn || !valid"
                        color="success"
                        @click="update"
                        >수정하기</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-app>
      </div>
    </v-container>
    <v-dialog v-model="modalOpen" max-width="300px" :scrollable="false">
      <v-card>
        <v-card-title>수정완료</v-card-title>
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
    enablebtn: false,
    valid: true,
    user: null,
    email: "",
    name: "",
    gender: "",
    nickname: "",
    phone: "",
    about: "",
    profile_url: "",
    platform_type: "",

    avatar: null,

    introducingRules: [
      v => !v || v.length <= 50 || "최대 50자까지 입력 가능합니다."
    ],
    nameRules: [v => !v || v.length <= 50 || "이름이 너무 깁니다."],
    genderItems: ["남성", "여성"],
    nicknameRules: [v => !v || v.length <= 10 || "닉네임은 최대 10자입니다."],
    phoneRules: [
      v =>
        (v && v.length >= 10 && v.length <= 11) ||
        "전화번호 형식이 올바르지 않습니다.",
      v =>
        !/(?=.*[a-zA-Z!@#$%^&*()_+=-?/'";{}])/.test(v) ||
        "전화번호 형식이 올바르지 않습니다."
    ],

    modalOpen: false,
    message: ""
  }),
  components: {
    imageInput: () => import("@/components/base/ImageInput")
  },

  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.confirmPassword ||
        "비밀번호가 서로 일치하지 않습니다.";
    }
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      var uid = this.$store.getters["auth/getUser"].uid;
      var user = await this.$store.dispatch("getUserContent", uid);
      this.email = user.email;
      this.name = user.name;
      this.gender = user.gender == "M" ? "남성" : "여성";
      this.nickname = user.nickname;
      this.phone = user.phone;
      this.about = user.about;
      this.profile_url = user.profile_url;
      this.platform_type = user.platform_type;

      this.user = user;
      this.message = '';
    },
    async update() {
      try {
        var formDate = new FormData();
        formDate.append("name", this.name);
        formDate.append("nickname", this.nickname);
        formDate.append("phone", this.phone);
        formDate.append("about", this.about);
        if (this.avatar == null) {
          formDate.append("image_update", false);
          formDate.append("img", null);
        } else {
          formDate.append("image_update", true);
          formDate.append("img", this.avatar.imageFile);
        }

        var res = await this.$store.dispatch("updateUser", formDate);
        if (res == 1) {
          this.modalOpen = true;
          await this.load()
          this.validation()
          this.$store.dispatch('auth/checkUserDefault')
        } else {
          this.message = "오류가 발생하여 수정되지 않았습니다";
        }
      } catch (err) {
        console.log(err);
      }
    },
    validation() {
      this.enablebtn = false;
      if (this.name != this.user.name) {
        this.enablebtn = true;
      }
      if (this.nickname != this.user.nickname) {
        this.enablebtn = true;
      }
      if (this.phone != this.user.phone) {
        this.enablebtn = true;
      }
      if (this.about != this.user.about) {
        this.enablebtn = true;
      }
      if (this.avatar != null) {
        this.enablebtn = true;
      }
    },
    imgClear(){
      this.avatar = null
    }
  },

  watch: {
    name() {
      if (this.name != this.user.name) {
        this.enablebtn = true;
      } else {
        this.validation();
      }
    },
    nickname() {
      if (this.nickname != this.user.nickname) {
        this.enablebtn = true;
      } else {
        this.validation();
      }
    },
    phone() {
      if (this.phone != this.user.phone) {
        this.enablebtn = true;
      } else {
        this.validation();
      }
    },
    about() {
      if (this.about != this.user.about) {
        this.enablebtn = true;
      } else {
        this.validation();
      }
    },
    avatar() {
      if (this.avatar != null) {
        this.enablebtn = true;
      } else {
        this.validation();
      }
    }
  }
};
</script>
