<template>
  <v-content class="pa-0">
    <v-card flat>
      <v-card-title class="pt-0 pb-0">
        <v-row no-gutters>
          <v-col cols="8">
            <v-icon class="black--text pl-1" x-large>notifications_none</v-icon>
            <span class="Hline ml-2">공지사항</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-actions>
        <v-row>
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

              <v-card flat v-show="notice_list.length === 0" class="mt-5">
                <v-row no-gutters style="height:100%" align="center" justify="center">
                  <v-col cols="12">
                    <v-card flat align="center" style="width: 100%; height: 100%">
                      <p class="board_content">등록된 공지사항이 없습니다.</p>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                v-show="!(notice_list.length === 0)"
                flat
                v-for="(post, index) in notice_list"
                :key="index"
                @click="routeTo(post.id)"
              >
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
      </v-card-actions>
    </v-card>
    <v-divider class="mx-5" />
    <v-card flat>
      <v-card-title class="pb-0">
        <v-row no-gutters>
          <v-col cols="8">
            <v-icon class="black--text pl-1" x-large>subject</v-icon>
            <span class="Hline ml-2">최근 게시물</span>
          </v-col>
          <v-col>
            <v-select v-model="board_name" :items="boards" dense class="pt-0 pr-3"></v-select>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-actions>
        <v-row>
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

              <v-card flat v-show="post_list.length === 0" class="mt-5">
                <v-row no-gutters style="height:100%" align="center" justify="center">
                  <v-col cols="12">
                    <v-card flat align="center" style="width: 100%; height: 100%">
                      <p class="board_content">등록된 게시글이 없습니다.</p>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                v-show="!(post_list.length === 0)"
                flat
                v-for="(post, index) in post_list"
                :key="index"
                @click="routeTo(post.id)"
              >
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
      </v-card-actions>
    </v-card>
  </v-content>
</template>

<script>
import { mapState } from "vuex";
import PostService from "@/services/post.service";

export default {
  props: ["study_id"],
  data: () => ({
    items: [],
    board_name: "스터디 게시판",
    board: "study",
    boards: [
      { text: "스터디 게시판", board: "study" },
      { text: "자유 게시판", board: "free" }
    ],
    post_list: [],
    notice_list: []
  }),
  created() {
    this.postUpdate();
  },
  watch: {
    board_name() {
      for (let i = 0; i < this.boards.length; i++) {
        if (this.boards[i].text === this.board_name) {
          this.board = this.boards[i].board;
        }
      }
      this.postUpdate();
    }
  },
  computed: {
    ...mapState(["isAuth"])
  },
  methods: {
    async noticePost() {
      const notice_list = await PostService.getAllPost({
        type: "study",
        study_id: this.study_id,
        board: "notice",
        offset: 0
      });
      this.notice_list = notice_list.data;
    },
    async postUpdate() {
      const post_list = await PostService.getAllPost({
        type: "study",
        study_id: this.study_id,
        board: this.board,
        offset: 0
      });
      this.post_list = post_list.data;
    },
    routeTo(post_id) {
      this.$router.push({
        name: "board_contents",
        params: { post_id: post_id, board_name: this.board }
      });
    }
  }
};
</script>

<style scoped>
.Hline {
  font-size: 25px !important;
  font-weight: bold !important;
}

.board_content {
  font-size: 18px !important;
  color: #808080 !important;
}
</style>