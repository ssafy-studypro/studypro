<template>
  <div id="footer">
    <v-btn
      v-scroll="onScroll"
      v-show="toTopBtn"
      fab
      fixed
      bottom
      right
      class="red"
      @click="toTop"
    >
      <v-icon class="white--text">fa-arrow-up</v-icon>
    </v-btn>
    <v-footer class="customTheme" padless>
      <v-row justify="center">
        <!-- <v-btn
          v-for="link in links"
          :key="link"
          color="white"
          text
          rounded
          class="my-2"
          @click="effect(link)"
          >{{ link }}</v-btn
        > -->
        <v-col
          class="customTheme lighten-1 text-center white--text"
          cols="12"
        >
          <span class="font-weight-light">StudyPRO</span>
          <v-spacer/>
          <span class="copyright">Copyrightⓒ2020 StudyPro All Rights Reserved</span>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toTopBtn: false,
      links: ["Home", "About Us", "Services", "Blog", "Contact Us"],
      effects: {
        aboutUs: false
      }
    };
  },
  methods: {
    effect(link) {
      switch (link) {
        case "About Us":
          this.effects.aboutUs = !this.effects.aboutUs
          setTimeout(() => {
              window.scrollTo(0, document.body.scrollHeight)
            }, 0.01);
          break;
      
        default:
          break;
      }
    },
    onScroll(scr) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || scr.target.scrollTop || 0;
      this.toTopBtn = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    }
  }
};
</script>

<style scoped>
.copyright {
  font-size: 10px !important;
}
.font-weight-light {
  font-size: 25px !important;
  font-weight: bold !important;
}
</style>