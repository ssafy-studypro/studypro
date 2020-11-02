<template>
  <div id="home">
    <v-img src="@/assets/images/banner/main.png" />
    <top/>
  </div>
</template>

<script>
export default {
  name: "home",

  data() {
    return {
      items: [
        { avatar: "@/assets/images/pengsoo.jpg" },
        {
          avatar:
            "https://lh3.googleusercontent.com/proxy/BrygeoVAlP2KobI6jyhQ6rLAITSeAncXc0e-Sm9W5vzUz-OJsKT7u2e0OEBkeDOvJtQ6aqazQUlpbUb5QlfDcyQd-8pC8vlW9Su2ux8Y4Ki_idbRfVXT"
        },
        { avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg" }
      ],
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4"
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"]
    };
  },

  components: {
    Top: () => import("@/components/home/Top")
    // TopRight: () => import("@/components/home/TopRight"),
    // Middle: () => import("@/components/home/Middle")
  }
};
</script>

<style>
.bannerContainer {
  height: 150px;
  overflow: hidden;
}
.banner {
  width: auto;
  height: 100%;
}
</style>
