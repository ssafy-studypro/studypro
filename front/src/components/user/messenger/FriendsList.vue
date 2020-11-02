<template>
  <v-list>
    <v-list-item v-for="user in userList" :key="user.id">
      <v-card elevation="0" width="1500">
        <v-row style="border-bottom: 1px solid #E5C1D4;">
          <v-col cols="2" align="center">
            <v-avatar size="40px" class="ma-0">
              <img :src="user.profile_url" />
            </v-avatar>
            <p style="font-size:14px" class="ma-0 pt-2">{{ user.nickname }}</p>
          </v-col>
          <v-col align-self="center" cols="8">
            <v-row></v-row>
          </v-col>
          <v-col align-self="center" cols="2">
            <v-btn color="green lighten-4" @click="viewDetail(user)"
              >쪽지 보내기</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-list-item>
    <template>
      <group-modal
        :group-modal="groupModal"
        :user="user"
        v-on:close="modalClose"
      />
    </template>
  </v-list>
</template>
<script>
import UserService from "@/services/user.service";
export default {
  data: () => ({
    groupModal: false,
    user: {},
    userItems: []
  }),
  props: ["tab"],
  computed: {
    isAuth: function() {
      return this.$store.getters.isAuth;
    },
    userList: function() {
      return this.userItems;
    }
  },
  components: {
    GroupModal: () => import("@/components/user/messenger/MsgSendModal")
  },
  methods: {
    viewDetail(user) {
      this.groupModal = true;
      this.user = user;
    },
    modalClose() {
      this.groupModal = false;
    }
  },
  async created() {
    console.log('FriendList created')
    const userInfo = await UserService.getAllUser();
    this.userItems = userInfo.data;
  },
  watch: {
    async tab(t) {
      if (t === 2) {
        const userInfo = await UserService.getAllUser();
        this.userItems = userInfo.data;
      }
    }
  }
};
</script>
