<template>
  <v-list>
    <v-list-item>
      <v-row style="border-bottom: 5px solid #1C6EA4;">
        <v-col align="center" cols="2">
          <span>받은 사람</span>
        </v-col>
        <v-col align="center" cols="8">
          <span>제 목</span>
        </v-col>
        <v-col align="center" cols="2">
          <span>보낸 시간</span>
        </v-col>
      </v-row>
    </v-list-item>
    <v-list-item v-for="msg in sendMsg" :key="msg.id">
      <v-card elevation="0" width="1500" @click="viewDetail(msg)">
        <v-row style="border-bottom: 1px solid #E5C1D4;">
          <v-col cols="2" align="center">
            <v-avatar size="40px" class="ma-0">
              <img :src="msg.to.profile_url" />
            </v-avatar>
            <p style="font-size:14px" class="ma-0 pt-2">
              {{ msg.to.nickname }}
            </p>
          </v-col>
          <v-col align-self="center" cols="8">
            <v-row>
              <span style="font-size:15px" class="ma-0">{{ msg.title }}</span>
            </v-row>
          </v-col>
          <v-col align-self="center" cols="2">
            <span style="font-size:15px" class="ma-0">
              {{ msg.created_date.substr(0, 10) }}
              {{ msg.created_date.substr(11, 5) }}
            </span>
          </v-col>
        </v-row>
      </v-card>
    </v-list-item>
    <template>
      <group-modal
        :group-modal="groupModal"
        :msg="msg"
        :tab="txtab"
        v-on:close="modalClose"
        v-on:clickRes="modalReload"
      />
    </template>
  </v-list>
</template>
<script>
import AlarmService from "@/services/alarm.service";
export default {
  data: () => ({
    groupModal: false,
    msg: {},
    txBox: [],
    txtab: "tx"
  }),
  props: ["tab"],
  computed: {
    isAuth: function() {
      return this.$store.getters.isAuth;
    },
    sendMsg: function() {
      return this.txBox;
    }
  },
  components: {
    GroupModal: () => import("@/components/user/messenger/MsgReceiveModal")
  },
  methods: {
    viewDetail(msg) {
      this.groupModal = true;
      this.msg = msg;
    },
    modalClose() {
      this.groupModal = false;
    },
    modalReload() {
      this.groupModal = false;
      this.groupModal = true;
    }
  },
  async created() {
    console.log('Txbox created')
    const sendMsg = await AlarmService.getSendAlarm();
    this.txBox = sendMsg.data;
  },
  watch: {
    async tab(t) {
      if (t === 1) {
        const sendMsg = await AlarmService.getSendAlarm();
        this.txBox = sendMsg.data;
        // console.log(this.txBox);
      }
    }
  }  
};
</script>
