<template>
  <v-content id="boardRegister">
    <v-row justify="center">
      <v-col cols="11">
        <v-card class="pa-5">
          <v-flex class="ma-2 mb-5">
            <v-icon large class="mr-2" color="black">edit</v-icon>새 글 작성
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
                <v-col>
                  <v-file-input
                    :rules="rules"
                    accept="image/png, image/jpeg, image/bmp"
                    outlined
                    v-model="files"
                    color="deep-purple accent-4"
                    label="Attach File"
                    counter
                    multiple
                    placeholder="Select Files"
                    prepend-icon="mdi-paperclip"
                    :show-size="1000"
                  >
                    <template v-slot:selection="{ index, text }">
                      <v-chip v-if="index < 5" color="deep-purple accent-4" dark label>{{ text }}</v-chip>
                      <span
                        v-else-if="index === 5"
                        class="overline grey--text text--darken-3 mx-2"
                      >+{{ files.length - 5 }} File(s)</span>
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
              <v-divider />
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

                  <v-btn class="mx-1 primary" @click="create">
                    <v-icon left dark>create</v-icon>글 작성
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
  props: ["study_id", "board_name"],
  components: {
    Editor: Editor,
    requestSignin: () => import("@/components/base/RequestSignin")
  },
  data() {
    return {
      items: ["study", "free"],
      dialog: false,

      postData: {
        type: "study",
        study_id: "",
        writer: "",
        title: "",
        content: "",
        board: "study"
      },

      files: [],
      rules: [
        value => value.size < 5000000 || "File size should be less than 5 MB"
      ],
    };
  },

  created() {
    this.postData.board = this.board_name;
  },

  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    }
  },

  methods: {
    async getPost() {
      const post = await PostService.getPostContents({
        type: "study",
        post_id: this.post_id
      });
      this.postData = post.data;
    },
    create() {
      let formData = new FormData();
      this.postData.writer = this.getUser().uid;
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("post_file", file);
      }
      formData.append("type", this.postData.type);
      formData.append("study_id", this.study_id);
      formData.append("title", this.postData.title);
      formData.append("content", this.postData.content);
      formData.append("board", this.postData.board);
      PostService.createPost(formData);
      this.$router.go(-1);
    },
    clickBack() {
      this.$router.go(-1);
    },
    getUser() {
      return this.$store.getters["auth/getUser"];
    }
  }
};
</script>

<style scoped>
</style>
