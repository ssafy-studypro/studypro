<template>
  <v-content id="boardModify">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="pa-5">
          <v-flex class="ma-2 mb-5">
            <v-icon large class="mr-2" color="black">refresh</v-icon>수정하기
          </v-flex>
          <v-card class="pa-3 px-5" outlined>
            <div v-if="isAuth">
              <v-row justify="center" class="mt-3">
                <v-col cols="12" md="3" sm="4" class="py-0">
                  <v-select
                    v-model="postData.board"
                    :items="items"
                    outlined
                    label="게시판을 선택하세요"
                    dense
                    solo
                  ></v-select>
                </v-col>
                <v-col cols="12" md="9" sm="8" class="py-0">
                  <v-text-field v-model="postData.title" clearable label="제목을 입력하세요" outlined dense></v-text-field>
                </v-col>
              </v-row>
              <v-divider class="mb-5 mt-0"/>
              <v-row style="min-height: 500px">
                <v-col class="py-0">
                  <Editor v-model="postData.content"
                  mode="wysiwyg"
                  previewStyle="vertical"
                  height="500px"/>
                </v-col>
              </v-row>
              <v-divider class="mt-5 mb-3" />
              <v-row>
                <v-col class="text-end">
                  <v-dialog v-model="dialog" persistent max-width="290">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-1 error" v-on="on">
                        <v-icon left dark>keyboard_backspace</v-icon>이전으로
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="error white--text pa-2 pl-5">경고</v-card-title>
                      <v-card-text class="pa-4 pb-2">
                        작성 중이던 내용이 사라집니다.
                        <br />이전 페이지로 이동하시겠습니까?
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="dialog = false">계속 작업하기</v-btn>
                        <v-btn color="green darken-1" text @click="clickBack">이전으로</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-btn class="mx-1 primary" @click="modify">
                    <v-icon left dark>refresh</v-icon>수정하기
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <request-signin v-else>
              <template v-slot:text>
                <p>글을 작성하시려면 로그인해주세요.</p>
              </template>
            </request-signin>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import PostService from "@/services/post.service";

import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";

import { Editor } from "@toast-ui/vue-editor";

export default {
  components: {
    Editor: Editor,
    requestSignin: () => import("@/components/base/RequestSignin")
  },
  data() {
    return {
      items: ["study", "free"],
      dialog: false,
      post_id: "",

      modified: {
        type: "",
        post_id: "",
        title: "",
        content: "",
        board: ""
      },
      postData: [],
      files: [],
      rules: [
        value => value.size < 5000000 || "File size should be less than 5 MB"
      ],
    };
  },

  created() {
    this.post_id = this.$route.params.post_id;
    this.getPost();
  },

  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    },
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    },
    isWriter() {
      return (
        this.post_contents.writer ===
        this.$store.getters["auth/getUser"].nickname
      );
    },
    post_like() {
      return this.post_contents.like;
    }
  },

  methods: {
    async modify() {
      this.modified.type = "study";
      this.modified.post_id = this.post_id;
      this.modified.title = this.postData.title;
      this.modified.content = this.postData.content;
      this.modified.board = this.postData.board;
      await PostService.modifyPost(this.modified);
      this.$router.go(-1);
    },
    clickBack() {
      this.$router.go(-1);
    },
    async getPost() {
      const tmp = await PostService.getPostContents({
        type: "study",
        post_id: this.post_id
      });
      this.postData = tmp.data;
    }
  }
};
</script>

<style scoped>
</style>