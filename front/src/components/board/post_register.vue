<template>
  <v-content id="boardRegister">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="pa-5">
          <v-flex class="ma-2 mb-5">
            <v-icon large class="mr-2" color="black">edit</v-icon>새 글 작성
          </v-flex>
          <v-card class="pa-3 px-5" outlined>
            <div v-if="isAuth">
              <v-row justify="center" class="pt-3">
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
              <v-divider class="mb-5 mt-0" />
              <v-row>
                <v-col cols="12" class="py-0"></v-col>
              </v-row>
              <v-row style="min-height: 500px">
                <v-col class="py-0">
                  <Editor
                    v-model="postData.content"
                    mode="wysiwyg"
                    previewStyle="vertical"
                    height="500px"
                  />
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
    <template>
      <ChkModal :openModal="chkOpen" v-on:close="ChkModalClose">
        <template v-slot:toolbar>
          <v-card-title class="error white--text pa-3 pl-3">경고</v-card-title>
        </template>
        <template v-slot:text>
          <span>{{errorDetail}}</span>
          <br><br>
        </template>
        <template v-slot:btn>
          <div class="text-right mr-4">
            <v-btn text class="primary--text mb-2" @click="ChkModalClose()">확인</v-btn>
          </div>
        </template>
      </ChkModal>
    </template>
  </v-content>
</template>

<script>
import PostService from "@/services/post.service";

import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";

import { Editor } from "@toast-ui/vue-editor";

export default {
  props: [ "board_name" ],
  components: {
    Editor: Editor,
    requestSignin: () => import("@/components/base/RequestSignin"),
    ChkModal: () => import("@/components/base/Modal")
  },
  data() {
    return {
      items: ["share", "free"],
      dialog: false,
      chkOpen: false,
      errorDetail: "",
      postData: {
        type: "common",
        writer: "",
        title: "",
        content: "",
        board: "share"
      },

      files: [],
      rules: [
        value => value.size < 5000000 || "File size should be less than 5 MB"
      ]
    };
  },

  created() {
    this.postData.board = this.$route.params.board_name;
  },

  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    }
  },

  methods: {
    create() {
      if (this.postData.title == "") {
        this.errorDetail = "제목을 입력해주세요.";
        this.chkOpen = true;
        return;
      }
      if (this.postData.content == "") {
        this.errorDetail = "내용을 입력해주세요";
        this.chkOpen = true;
        return;
      }

      let formData = new FormData();
      this.postData.writer = this.getUser().uid;
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("post_file", file);
      }
      formData.append("type", this.postData.type);
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
    },
    ChkModalClose() {
      this.chkOpen = false;
    }
  }
};
</script>

<style scoped>
</style>
