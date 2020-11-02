<template>
  <div id="groupmodal">
    <v-dialog v-model="open" max-width="40%">
      <v-card id="lgiModal" class="px-0 pt-0">
        <v-card-title class="customTheme darken-2 white--text pb-3">
          <span class="headline">[받는 사람] {{ user.nickname }}</span>
        </v-card-title>
        <v-card-text class="py-0 px-7">
          <v-container class="pb-0">
            <v-row class="justify-center">
              <v-avatar size="140" color="white" class="ma-5">
                <v-img :src="user.profile_url"></v-img>
                <!-- <v-icon size="140">mdi-account-circle</v-icon> -->
              </v-avatar>
            </v-row>
            <v-row class="pt-6, ma-0">
              <v-col cols="12" class="pa-0">
                <v-text-field
                  class="px-10"
                  label="제목"
                  outlined
                  single-line
                  v-model="titleText"
                  counter
                  maxlength="30"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="pt-6, ma-0">
              <v-col cols="12" class="pa-0">
                <v-textarea
                  class="px-10"
                  label="보낼 메시지"
                  outlined
                  single-line
                  v-model="mainText"
                  counter
                  maxlength="150"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0 pr-5">
          <v-spacer></v-spacer>
          <v-btn
            color="error--text lighten-1 transparent"
            elevation="0"
            @click="clickExit"
            >닫기</v-btn
          >
          <v-btn
            color="primary--text transparent"
            elevation="0"
            @click="clickSend"
            >보내기</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template>
      <check-modal
        :check-modal="checkModal"
        :to="user.id"
        :titleText="titleText"
        :mainText="mainText"
        v-on:sendNo="sendNo"
        v-on:sendYes="sendYes"
      />
    </template>
  </div>
</template>
<script>
export default {
  show: false,
  name: "groupmodal",
  data: () => ({
    open: false,
    mainText: "",
    titleText: "",
    checkModal: false
  }),
  props: ["groupModal", "gid", "user"],
  components: {
    CheckModal: () => import("@/components/user/messenger/CheckModal")
  },
  watch: {
    groupModal() {
      this.open = this.groupModal;
    },
    open() {
      if (this.open == false) {
        this.showResponse = false;
        this.$emit("close");
      }
    },
    user() {
      console.log(this.user)
    }
  },
  methods: {
    sendNo() {
      this.checkModal = false;
    },
    sendYes() {
      this.mainText = "";
      this.titleText = "";
      // this.checkModal = false;
      this.open = false;
    },
    clickExit() {
      this.mainText = "";
      this.titleText = "";
      this.open = false;
    },
    async clickSend() {
      //보내는 통신
      this.checkModal = true;
    }
  }
};
</script>
