<template>
  <v-content id="study" class="pa-0">
    <div v-if="isAuth">
      <v-navigation-drawer absolute permanent expand-on-hover v-if="isAuth">
        <v-list>
          <v-list-item class="mt-2">
            <v-list-item-avatar>
              <v-img :src="currentUser.profile_url"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>{{ currentUser.nickname }}</v-list-item-title>
          </v-list-item>
          <v-divider class="ma-3 mb-0" />
          <v-list-item
            v-for="(menu, index) in menus"
            :key="index"
            @click="routeTo(menu.route)"
          >
            <v-list-item-icon>
              <v-icon medium>{{ menu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="toWorkspace">
            <v-list-item-icon>
              <v-icon medium>developer_board</v-icon>
            </v-list-item-icon>
            <v-list-item-title>스터디 룸</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider class="mx-3" />
        <!-- <v-list>
        <v-list-item @click="routeTo()">
          <v-list-item-icon>
            <v-icon medium>check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>출석체크</v-list-item-title>
        </v-list-item>
        <v-list-item @click="routeTo()">
          <v-list-item-icon>
            <v-icon medium>settings</v-icon>
          </v-list-item-icon>
          <v-list-item-title>관리자 메뉴</v-list-item-title>
        </v-list-item>
      </v-list> -->
      </v-navigation-drawer>

      <v-card flat>
        <div id="group-img-container">
          <v-img src="@/assets/images/banner/group_default.png" />
          <v-row justify="end" v-if="currentUser.uid == studyInfo.captain">
            <v-btn text id="group-img-btn">
              <v-icon color="white">settings</v-icon>
            </v-btn>
          </v-row>
        </div>
        <v-row no-gutters justify="center">
          <v-col offset="1" cols="11" class="mr-7 mt-5">
            <router-view @toWorkspace="toWorkspace"></router-view>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <request-signin v-else />
  </v-content>
</template>

<script>
import StudyService from "@/services/study.service";
import AuthService from "@/services/auth.service";
let open_workspace = null;

export default {
  props: ["study_id"],
  data() {
    return {
      menus: [
        {
          icon: "home",
          title: "홈으로",
          route: {
            routes: "study_home",
            params: { study_id: this.study_id }
          }
        },
        {
          icon: "date_range",
          title: "일정 관리",
          route: {
            routes: "study_schedule"
          }
        },
        {
          icon: "library_books",
          title: "게시판",
          route: {
            routes: "study_board",
            params: { board_name: "study" }
          }
        },
        {
          icon: "group",
          title: "스터디 멤버",
          route: {
            routes: "study_member"
          }
        }
      ],
      studyInfo: {}
    };
  },
  components: {
    requestSignin: () => import("@/components/base/RequestSignin")
  },

  async mounted() {
    await this.loadStudyInfo();
    if (this.studyInfo.level) {
      this.isJoined = true;
    } else {
      this.isJoined = false;
    }
    window.closechild = () => {
      open_workspace.close();
    };
  },

  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    },
    currentUser() {
      return this.$store.getters["auth/getUser"];
    }
  },

  methods: {
    async loadStudyInfo() {
      await AuthService.checkUserDefault();
      this.studyInfo = await StudyService.getStudyInfo({
        study_id: this.study_id
      }).then(res => {
        return res.data;
      });
      if (this.studyInfo.state == "fail") {
        this.$router.push({ name: "home" });
      }
    },

    routeTo(route) {
      this.$router.push({ name: route.routes, params: route.params });
    },
    toWorkspace() {
      if (!this.isJoined) {
        window.alert("스터디에 가입해주세요");
        return;
      }
      let workspace = this.$router.resolve({
        name: "workspace",
        params: { study_id: this.study_id }
      });
      open_workspace = window.open(workspace.href, "WORKSPACE", "a");
    }
  }
};
</script>
