<template>
  <div class="tabs">
    <p class="pt-5 pl-5" style="font-size:25px">최근 게시글</p>
    <v-tabs>
      <v-tab @click="tabSwitch('ng')">학습 게시판</v-tab>
      <v-tab @click="tabSwitch('np')">자유 게시판</v-tab>
      <v-tab v-if="isAuth">My Groups</v-tab>
    </v-tabs>

    <v-list three-line v-if="current === 'ng'">
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader>

        <v-divider
          v-else-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-item v-else :key="item.title">
          <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <!-- <v-list three-line v-else-if="current === 'np'">
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader>

        <v-divider
          v-else-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-item v-else :key="item.title">
          <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list> -->

  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "tabs",
  data: () => ({
    current: "ng",
    items: [
      { header: "Today" },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "아니근데",
        subtitle:
          "<span class='text--primary'>펭수</span> &mdash; 참치가 최고야"
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: "ㄴ 2222",
        subtitle:
          "<span class='text--primary'>뚝딱이</span> &mdash; 참치 JMT ㅇㅈㅇㅈ"
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "쉽지 않네..",
        subtitle:
          "<span class='text--primary'>뽀로로</span> &mdash; vue 되는게 없네.."
      },
      { divider: true, inset: true },
      
    ]
  }),
  computed: {
    ...mapState(["isAuth"])
  },
  methods: {
    studyEnter() {
      console.log("Clicked...");
    },
    tabSwitch(target) {
      this.current = target;
    }
  }
};
</script>
