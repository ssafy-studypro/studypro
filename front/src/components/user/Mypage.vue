<template>
  <div id="mypage">
    <v-form v-if="isAuth">
      <v-card flat class="mt-1">
        <v-tabs vertical>
          <v-tab class="justify-start py-3">
            <v-icon>mdi-account</v-icon>
            <span class="d-none d-sm-flex ml-5">정보 수정</span>
          </v-tab>
          <v-tab class="py-3">
            <v-icon>mdi-lock</v-icon>
            <span class="d-none d-sm-flex ml-5">비밀번호 변경</span>
          </v-tab>

          <v-tab-item>
            <edit-profile />
          </v-tab-item>

          <v-tab-item>
            <manage-study />
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-form>
    <request-signin v-else>
      <template v-slot:text>
        <p>로그인이 필요합니다</p>
      </template>
    </request-signin>
  </div>
</template>

<script>
export default {
  components: {
    EditProfile: () => import("@/components/user/mypage/EditProfile"),
    ManageStudy: () => import("@/components/user/mypage/ChangePassword"),
    requestSignin: () => import("@/components/base/RequestSignin")
  },
  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    }
  }
};
</script>
