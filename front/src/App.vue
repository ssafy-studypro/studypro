<template>
  <v-app id="app">
    <v-row justify="center">
      <v-col class="py-0" cols="12" lg="9" md="12" sm="12">
        <router-view name="header" />
        <router-view class="main-view" />
        <router-view name="footer" />
      </v-col>
    </v-row>
    <router-view name="submain" />
  </v-app>
</template>

<script>
import WbKakao from "@/social-signin/kakao/kakao";

export default {
  mounted() {
    window.scrollTo(0, 0);
    this.$store.dispatch("auth/checkUserDefault");
    WbKakao.init();
  }
};
</script>

