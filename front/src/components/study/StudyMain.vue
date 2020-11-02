<template>
  <div id="studymain">
    <v-img src="@/assets/images/banner/study.png" />
    <div id="study-content">
    <v-card elevation="0">
      <v-tabs vertical v-model="tabIndex">
        <v-tab class="study-tabs" v-for="item in titles" :key="item.title">
          <v-icon left>{{ item.icon }}</v-icon>
          <span class="d-none d-sm-flex ml-3">{{ item.title }}</span>
        </v-tab>
        <v-tab-item>
          <study-search />
        </v-tab-item>
        <v-tab-item>
          <group-list v-if="isAuth" />
          <request-signin v-else>
            <template v-slot:text>
              <p>
                로그인해주세요.
              </p>
            </template>
          </request-signin>
        </v-tab-item>
        <v-tab-item>
          <div v-if="created === 0">
            <create-group v-if="isAuth" v-on:success="success" />
            <request-signin v-else>
              <template v-slot:text>
                <p>
                  모임을 생성하려면 로그인이 필요합니다.<br />로그인해주세요.
                </p>
              </template>
            </request-signin>
          </div>
          <create-success v-else :id="created" v-on:movegroups="moveGroups" />
        </v-tab-item>
      </v-tabs>
    </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "studymain",
  data: () => ({
    tabIndex: 0,
    titles: [
      {
        icon: "mdi-magnify",
        title: "스터디 검색"
      },
      {
        icon: "list",
        title: "내 스터디 보기"
      },
      {
        icon: "mdi-book-open-variant",
        title: "스터디 생성"
      }
    ],
    created: 0
  }),
  watch: {
    tabIndex() {
      if (this.tabIndex == 2) {
        this.created = 0;
      }
    }
  },
  components: {
    studySearch: () => import("@/components/study/Search"),
    createGroup: () => import("@/components/study/CreateGroup"),
    groupList: () => import("@/components/user/MyGroupList"),
    requestSignin: () => import("@/components/base/RequestSignin"),
    createSuccess: () => import("@/components/study/CreateSuccess")
  },
  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    },

    getTitle() {
      return this.titles[this.tabIndex].title;
    }
  },
  methods: {
    moveGroups() {
      this.tabIndex = 1;
    },
    success(gid) {
      this.created = gid;
    }
  },
  mounted() {
    if (this.$route.path.split("/")[2] == "mygroups") {
      this.tabIndex = 1;
    }
  }
};
</script>
