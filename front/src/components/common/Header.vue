<template>
  <div id="header">
    <v-app-bar prominent flat height="56px">
      <v-row id="header-container">
        <!-- 로고 -->
        <v-col class="header-logo-container" cols="4" sm="3" md="2">
          <router-link to="/home">
            <v-img
              class="logo"
              src="@/assets/images/LogoText7.png"
              contain
            ></v-img>
          </router-link>
        </v-col>
        <!-- 로고 끝 -->
        <!-- 메뉴 -->
        <v-col class="header-menu-container d-none d-sm-flex" sm="6" md="8">
          <template>
            <v-tabs class="header-menu justify-center" show-arrows>
              <v-tab :to="menu.route" v-for="menu in menus" :key="menu.title">
                <v-icon left>{{ menu.icon }}</v-icon>
                <span class="d-none d-lg-flex">{{ menu.title }}</span>
              </v-tab>
            </v-tabs>
          </template>
        </v-col>
        <!-- 메뉴 끝 -->
        <!-- 유저메뉴 / 햄버거 -->
        <v-col class="header-usermenu-container pl-0" cols="8" sm="3" md="2">
          <v-btn
            class="header-user-btn d-none d-sm-inline-block px-0"
            @click="toSignup"
            v-if="!isAuth"
            text
            >회원가입</v-btn
          >
          <v-btn
            class="header-user-btn d-none d-sm-inline-block px-0"
            @click="signinModal = true"
            v-if="!isAuth"
            text
            >로그인</v-btn
          >

          <v-app-bar-nav-icon
            @click="drawer = true"
            class="header-user-btn d-flex d-sm-none"
          ></v-app-bar-nav-icon>
          <!-- 유저 이미지 -->
          <v-row justify="end">
            <!-- <v-col class="pa-0" sm="2">
              <div v-if="isAuth" class="header-user-btn align-center" @click="toMail">
                <v-badge :content="numAlarm" :value="numAlarm" color="red" overlap>
                  <v-icon v-if="isAuth" class="black--text">mdi-email</v-icon>
                  <v-icon v-else class="gray--text">mdi-email</v-icon>
                </v-badge>
              </div>
            </v-col> -->
            <v-col class="pa-0" sm="10">
              <template v-if="isAuth">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      x-large
                      class="header-user-btn pa-0"
                      id="header-user-drop"
                      v-on="on"
                    >
                      <v-badge
                        :content="numAlarm"
                        :value="numAlarm"
                        color="red"
                        overlap
                      >
                        <v-avatar size="30" class="mx-1">
                          <v-img
                            :src="currentUser.profile_url"
                          ></v-img> </v-avatar
                      ></v-badge>
                      <span class="ml-2"> {{ currentUser.nickname }} </span>
                      <v-icon class="mx-3">keyboard_arrow_down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(menu, index) in usermenuitems"
                      :key="index"
                      @click="clickUserMenu(menu.name)"
                    >
                      <v-badge
                        v-if="index == 0"
                        :content="numAlarm"
                        :value="numAlarm"
                        color="red"
                        overlap
                      >
                        <v-icon v-if="isAuth" class="gray--text"
                          >mdi-email</v-icon
                        >
                        <v-icon v-else class="gray--text">mdi-email</v-icon>
                      </v-badge>
                      <v-icon v-else>{{ menu.icon }}</v-icon>

                      <v-list-item-title class="ml-3">{{
                        menu.title
                      }}</v-list-item-title>

                      <!-- <v-icon >{{menu.icon}}</v-icon> -->
                      <!-- <v-list-item-title>{{ menu.title }}</v-list-item-title> -->
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-col>
          </v-row>
          <!-- </v-container> -->
          <!-- 유저 이미지 끝 -->
        </v-col>
      </v-row>
    </v-app-bar>
    <!-- Signin Modal Boxs -->
    <signin-modal :signinModal="signinModal" v-on:close="signinClose" />
    <!-- Navigation Bar -->
    <v-navigation-drawer
      app
      right
      v-model="drawer"
      color="black"
      disable-resize-watcher
      id="navDrawer"
    >
      <div>
        <v-layout column transparent>
          <v-flex class="mt-2">
            <v-container>
              <v-icon large class="white--text" @click="drawer = false"
                >keyboard_arrow_right</v-icon
              >
              <router-link class="ml-10" to="/home" text-decoration="none">
                <span class="logo white--text font-weight-light">Study</span>
                <span class="logo white--text">PRO</span>
              </router-link>
            </v-container>
          </v-flex>
        </v-layout>
      </div>
      <v-divider class="black ma-1" />
      <!-- Navigations -->
      <v-list>
        <v-list-item
          v-for="item in navigations"
          :key="item.title"
          :to="item.route"
        >
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- User Pages -->
      <v-container class="my-0 pa-0" v-if="isAuth">
        <v-divider class="white ma-5 mt-0" />
        <v-layout column align-center>
          <v-flex>
            <router-link to="/user/mypage">
              <v-avatar size="100" class="mb-3">
                <img :src="currentUser.profile_url" alt />
              </v-avatar>
            </router-link>
            <p align="center" class="white--text subheading">
              {{ currentUser.nickname }}
            </p>
          </v-flex>
        </v-layout>
        <v-list>
          <v-list-item
            v-for="item in userpages"
            :key="item.title"
            :to="item.route"
          >
            <v-list-item-content>
              <v-list-item-title class="white--text">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
      <v-container v-else></v-container>
      <template v-slot:append>
        <v-card-actions class="justify-center" v-if="!isAuth">
          <v-btn text class="pink--text" @click="signinModal = true"
            >로그인</v-btn
          >
          <v-btn
            text
            class="pink--text transparent"
            elevation="0"
            to="/user/signup"
            >회원가입</v-btn
          >
        </v-card-actions>
        <v-card-actions class="justify-center" v-else>
          <v-btn text class="pink--text" @click="signout">로그아웃</v-btn>
        </v-card-actions>
      </template>
    </v-navigation-drawer>
  </div>
</template>
<script>
import AlarmService from "@/services/alarm.service";
import { EventBus } from "@/plugins/event-bus";

export default {
  name: "appHeader",
  data() {
    return {
      drawer: false,
      signinModal: false,
      checkbox: false,
      usermenu: false,
      menus: [
        { icon: "home", title: "홈", route: "/home" },
        { icon: "group", title: "스터디", route: "/study/search" },
        { icon: "library_books", title: "게시판", route: "/board/share" },
        { icon: "date_range", title: "일정", route: "/calendar/mycal" },
        { icon: "accessibility_new", title: "내 정보", route: "/user/mypage" }
      ],
      navigations: [
        { title: "스터디 홈", route: "/home" },
        { title: "스터디", route: "/study/search" },
        { title: "게시판", route: "/board/share" }
      ],
      userpages: [
        { title: "정보 수정", route: "/user/mypage" },
        { title: "일정 관리", route: "/calendar/mycal" }
      ],
      usermenuitems: [
        { icon: "email", title: "쪽지함", name: "msgbox" },
        { icon: "mdi-account", title: "정보수정", name: "info" },
        { icon: "list", title: "가입목록", name: "groups" },
        { icon: "library_books", title: "일정관리", name: "calendar" },
        { icon: "mdi-lock", title: "로그아웃", name: "signout" }
      ],
      userInfo: {},
      isLoading: false,
      numAlarm: 0
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    },
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    }
  },
  watch: {
    $route() {
      this.getAlarmNumber();
    }
  },
  components: {
    signinModal: () => import("@/components/user/SigninModal")
  },
  methods: {
    signinClose() {
      this.signinModal = false;
    },
    signout() {
      this.isLoading = true;
      this.$store.dispatch("auth/logout");
      this.isLoading = false;
      if (this.$route.path.split("/")[1] != "home") {
        this.$router.push({ name: "home" });
      }
    },
    clickUserMenu(name) {
      if (name == "info") {
        this.$router.push({ path: "/user/mypage" });
      } else if (name == "groups") {
        this.$router.push({ path: "/study/mygroups" });
      } else if (name == "calendar") {
        this.$router.push({ path: "/calendar/mycal" });
      } else if (name == "signout") {
        this.signout();
      } else if (name == "msgbox") {
        this.toMail();
      }
    },
    // 회원가입 클릭 메소드
    toSignup() {
      var path = this.$route.path.split("/");
      if (path[1] == "user" && path[2] == "signup") {
        return;
      } else {
        this.$router.push({ name: "signup" });
      }
    },
    toMail() {
      if (this.$route.path.split("/")[1] != "msgbox") {
        this.$router.push({ name: "msgbox" });
      }
    },
    getAlarmNumber() {
      AlarmService.getAlarmNumber().then(numAlarm => {
        this.numAlarm = numAlarm.data.num_alarm || 0;
      });
    }
  },
  created() {
    this.getAlarmNumber();
    EventBus.$on("mailChk", () => {
      this.getAlarmNumber();
    });
  }
};
</script>
