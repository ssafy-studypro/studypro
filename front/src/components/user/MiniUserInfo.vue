<template>
  <div>
    <v-row class="mx-1">
      <v-col>
        <v-btn @click="logout()" class="transparent" elevation="0" style="float:right;">
          <span class="italic">로그아웃</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-flex justify-center>
        <span class="mr-2">Hello!!</span>
        <span class="blue--text lighten-2">{{ currentUser.nickname }}</span>
      </v-flex>
    </v-row>
  </div>
</template>

<script>
import AlarmService from "@/services/alarm.service";

export default {
  data: () => ({
    numAlarm: null
  }),
  created() {
    AlarmService.getAlarmNumber().then(numAlarm => {
      this.numAlarm = numAlarm.data.num_alarm;
    });
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push({name:'home'})
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    }
  }
};
</script>