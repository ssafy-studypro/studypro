<template>
  <div id="board">
    <v-img src="@/assets/images/banner/board.png" />
    <div id="board-content">
      <v-row no-gutters>
        <v-col style="max-width: 200px;">
          <v-card flat>
            <v-list flat>
              <v-list-item-group v-model="menu" class="primary--text">
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
          <v-card class="ma-2" flat>
            <boardList :board="boardList" />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import boardList from "@/components/board/board_list";

export default {
  name: "board",
  data() {
    return {
      board_list: "share",
      menu: 0,
      menus: [
        { icon: "menu_book", text: "정보 공유", route: "share" },
        { icon: "style", text: "자유 게시판", route: "free" },
        { icon: "notifications_none", text: "공지사항", route: "notice" }
      ]
    };
  },

  created() {
    if (this.$route.params.board) {
      this.board_list = this.$route.params.board;
    }
  },

  computed: {
    boardList: function() {
      return this.board_list;
    }
  },

  watch: {
    $route() {
      if (this.$route.params.board !== null) {
        this.board_list = this.$route.params.board;
      }
    }
  },

  methods: {
    routeTo(route) {
      this.$router.push({ name: "board", params: { board: route } });
    }
  },

  components: {
    boardList
    // postContent
  }
};
</script>
<!--style>
.router-link-active {
  color: white;
  background-color: red;
}
</style-->
