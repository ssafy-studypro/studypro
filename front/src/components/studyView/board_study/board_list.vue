<template>
  <v-container flex>
    <v-flex class="ma-2">
      <v-icon large class="mr-2" color="black">{{ menuIcon }}</v-icon>
      {{ menuText }}
      <v-btn
        style="float: right;"
        @click="register"
        class="mx-1 green white--text"
        v-show="showBtn"
      >
        <v-icon class="mr-3" dark>create</v-icon>글 작성
      </v-btn>
    </v-flex>
    <v-divider class="mx-3 mt-5" />
    <v-row no-gutters>
      <v-col>
        <router-view class="pa-0" />
      </v-col>
    </v-row>
    <v-divider class="mx-3 mb-3" />
    <v-row justify="center">
      <v-col>
        <v-card outlined class="px-3 py-2 mx-3">
          <v-row>
            <v-col align="center" cols="1" class="pa-1 px-3">No.</v-col>
            <v-divider class="my-2" vertical />
            <v-col cols="6" class="pa-2 pl-5">제목</v-col>
            <v-spacer />
            <v-divider class="my-2" vertical />
            <v-col align="center" cols="2" class="pa-2 px-3">작성자</v-col>
            <v-col align="center" cols="1" class="pa-2 px-3">조회</v-col>
            <v-col align="center" cols="1" class="pa-2 px-3">추천</v-col>
          </v-row>
          <v-divider class="ma-2" />

          <v-card flat v-for="(post, index) in post_list" :key="index" @click="routeTo(post.id)">
            <v-row>
              <v-col align="center" cols="1" class="pa-2 px-3">
                {{
                post.id
                }}
              </v-col>
              <v-divider class="my-2" vertical />
              <v-col cols="6" class="pa-2 pl-5">{{ post.title }}</v-col>
              <v-spacer />

              <v-divider class="my-2" vertical />
              <v-col align="center" cols="2" class="pa-2 px-3">
                {{
                post.writer
                }}
              </v-col>
              <v-col align="center" cols="1" class="pa-2 px-3">
                {{
                post.view
                }}
              </v-col>
              <v-col align="center" cols="1" class="pa-2 px-3">{{post.num_like}}</v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="ma-3" />

    <v-row justify="center" class="my-3 mx-1">
      <v-col>
        <v-pagination v-model="page" :length="lastpage" :total-visible="10"></v-pagination>
        <v-btn
          style="float: right;"
          @click="register"
          class="mx-1 green white--text"
          v-show="showBtn"
        >
          <v-icon class="mr-3" dark>create</v-icon>글 작성
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostService from "@/services/post.service";
import StudyService from '@/services/study.service'

export default {
  props: [ "board_name", "study_id" ],
  data() {
    return {
      menuIcon: "menu_book",
      menuText: "스터디 게시판",

      page: 1,
      lastpage: 1,
      post_number: 0,
      post_list: [],

      menus: [
        { icon: "menu_book", text: "스터디 게시판", route: "study" },
        { icon: "style", text: "자유 게시판", route: "free" },
        { icon: "notifications_none", text: "공지사항", route: "notice" }
      ],
      studyInfo: {},
    };
  },

  created() {
    this.postUpdate();
    this.board = this.board;
    if (this.$router.params && this.$router.params.post_id) {
      this.routeTo(this.$router.params.post_id);
    }

    this.loadStudyInfo();
  },
  watch: {
    page() {
      this.postUpdate();
    },
    board_name() {
      this.postUpdate();
      for (let i = 0; i < this.menus.length; i++) {
        if (this.menus[i].route === this.board_name) {
          this.menuIcon = this.menus[i].icon;
          this.menuText = this.menus[i].text;
        }
      }
      this.page = 1;
    },
    $route() {
      this.postUpdate();
    }
  },
  computed: {
    postList: function() {
      return this.post_list;
    },
    showBtn() {
      if (this.board_name === "notice") {
        if(this.isCaptain) return true;
        return false;
      }
      return true;
    },
    currentUser(){
      return this.$store.getters['auth/getUser']
    },
    isCaptain(){
      if(this.currentUser.uid == this.studyInfo.captain){
        return true;
      }
      return false;
    }
  },
  methods: {
    async postUpdate() {
      const post_num = await PostService.getPostNumber({
        type: "study",
        board: this.board_name,
        study_id: this.study_id,
      });
      this.lastpage =
        parseInt(post_num.data.post_number / 10) +
        (post_num.data.post_number % 10 === 0 ? 0 : 1);

      const post_list = await PostService.getAllPost({
        type: "study",
        board: this.board_name,
        study_id: this.study_id,
        offset: (this.page - 1) * 10
      });
      this.post_list = post_list.data;
    },
    routeTo(post_id) {
      this.$router.push({
        name: "board_contents",
        params: { post_id: post_id, board_name: this.board_name }
      });
    },
    register() {
      this.$router.push({
        name: "study_register",
        params: { study_id: this.study_id, board_name: this.board_name },
      })
    },

    async loadStudyInfo() {
      this.studyInfo = await StudyService.getStudyInfo({
        study_id: this.study_id
      }).then(res => {
        return res.data;
      });
    },
  }
};
</script>

<style scoped></style>
