<template>
  <div class="mx-5">
    <v-row class="justify-center">
      <v-col class="pb-0" sm="11">
        <v-btn large block color="primary" @click="signinModal = true">Sign In</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center pt-1 pb-0">
        <v-btn to="user/signup" text small>Create Acount</v-btn>
      </v-col>
    </v-row>

    <signin-modal :signin-modal="signinModal" v-on:close="signinClose"/>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    email: '',
    password: '',
    signinModal: false,
    checkbox: false,
  }),
  components: {
    signinModal: () => import('@/components/user/SigninModal')
  },
  methods: {
    signinClose(){
      this.signinModal = false
    },
  },
}
</script>