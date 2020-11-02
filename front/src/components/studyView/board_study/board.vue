<template>
  <v-content id="board" class="pa-0">
    <v-row justify="center">
      <v-col cols="12">
        <v-card flat>
          <v-row no-gutters>
            <v-col style="max-width: 200px;">
              <v-card flat>
                <v-list flat>
                  <v-list-item-group>
                    <v-list-item
                      color="blue darken-2"
                      v-for="(menu, index) in menus"
                      :key="index"
                      @click="routeTo(menu.route)"
                    >
                      <v-list-item-icon>
                        <v-icon>{{ menu.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ menu.text }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat class="ma-2">
                <boardList :board_name="boardList" :study_id="$route.params.study_id" />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import boardList from "@/components/studyView/board_study/board_list";

export default {
  data() {
    return {
      board_list: "study",
      menus: [
        { icon: "menu_book", text: "스터디 게시판", route: "study" },
        { icon: "style", text: "자유 게시판", route: "free" },
        { icon: "notifications_none", text: "공지사항", route: "notice" }
      ]
    };
  },

  created() {
    if (this.$route.params.board_name) {
      this.board_list = this.$route.params.board_name;
    }
  },

  computed: {
    boardList: function() {
      return this.board_list;
    },
    currentUser() {
      return this.$store.getters["auth/getUser"];
    },
  },

  watch: {
    $route() {
      if (this.$route.params.board_name !== null) {
        this.board_list = this.$route.params.board_name;
      }
    }
  },

  methods: {
    routeTo(route) {
      this.$router.push({ name: "study_board", params: { board_name: route } });
    }
  },

  components: {
    boardList
    // postContent
  }
};
</script>
