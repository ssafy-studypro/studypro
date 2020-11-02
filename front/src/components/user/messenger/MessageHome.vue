<template>
  <v-content>
    <v-container>
      <div class="tabs">
        <v-toolbar flat color="black" dark>
          <v-toolbar-title style="font-size:30px">쪽지함</v-toolbar-title>
        </v-toolbar>
        <v-tabs v-model="tab">
          <v-tab>받은 쪽지함</v-tab>
          <v-tab>보낸 쪽지함</v-tab>
          <v-tab>주소록</v-tab>
          <v-tab-item>
            <rx-box :tab="tab" />
          </v-tab-item>
          <v-tab-item>
            <tx-box :tab="tab" />
          </v-tab-item>
          <v-tab-item>
            <friends-list :tab="tab" />
          </v-tab-item>
        </v-tabs>
      </div>
    </v-container>
  </v-content>
</template>
<script>
export default {
  data: () => {
    return {
      tab: null
    };
  },
  components: {
    RxBox: () => import("@/components/user/messenger/RxBox"),
    TxBox: () => import("@/components/user/messenger/TxBox"),
    FriendsList: () => import("@/components/user/messenger/FriendsList")
  },
  methods: {}
};
</script>
