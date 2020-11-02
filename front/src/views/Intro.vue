<template>
  <section id="intro">
    <v-layout column class="fill-height ml-7">
      <v-row align="center" style="height:40%">
        <v-col sm="11">
          <router-link class="routerText" to="/home">
          <span class="logo font-weight-light" disabled>Study</span>
          <span class="logo" disabled>PRO</span>
          </router-link>
        </v-col>
      </v-row>
      <v-row style="height:20%;">
        <v-col >
          <p class="explain" style="width:75%" disabled>온라인으로 끝까지 공부하는 가장 확실한 방법! 스터디 프로</p>
        </v-col>
      </v-row>
      <v-row style="height:30%">
          <v-col class="mr-12 pr-12" align="end">
            <v-btn to="/home" text>
                <v-icon class="pr-7" size="60" color="rgba(255,255,255,1)" left>exit_to_app</v-icon>
                <span class="btntext display-3 font-italic">Enter</span>
            </v-btn>
          </v-col>
      </v-row>
    </v-layout>
  </section>
</template>

<script>
export default {
  name: "intro",
  mounted(){
    this.$router.push({name:'home'})
  }
};
</script>

<style>
#intro {
  background: url("../assets/images/IntroBackground.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 100vh; /* calc(100vh - 60px);*/
}

.logo {
  font-size: 15vw;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer !important;
}

.explain {
    font-size: 4vw;
    color: rgba(0, 0, 0, 0.7);
}

.btntext {
    color: rgba(255, 255, 255, 1);
    align-content: flex-end
}
</style>
