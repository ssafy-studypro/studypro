<template>
  <v-card class="mx-auto mb-2" width="600">
    <v-row justify="space-around" class="pt-10">
      <router-link to="/mypage">
        <v-avatar height="120" width="130">
          <img src="@/assets/images/pengsoo.jpg" />
        </v-avatar>
      </router-link>
    </v-row>

    <v-card-subtitle style="font-size:20px" class="pb-5">펭수</v-card-subtitle>

    <v-card-text class="text--primary">
      <div>출석 일수 : 10일</div>

      <div>등급 : 다이아 회원</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="orange">
        출석체크
      </v-btn>

      <v-btn color="red">
        탈퇴할래
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
