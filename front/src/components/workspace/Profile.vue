<template>
    <v-menu v-model="profile.showProfile" :position-x="profile.x" :position-y="profile.y" offset-y absolute>
      <v-card width="300">
        <v-list class="pa-0">
          <v-list-item>
            <v-list-item-avatar>
              <img :src="showing_user.profile_url" alt="Profile" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{showing_user.nickname}}</v-list-item-title>
            </v-list-item-content >
            <v-list-item-content @click="viewDetail(showing_user)">
              <a><img v-if="show_profile_id !== user.user_id" src="@/assets/images/post_img.png" alt="" style="float: right"></a>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>{{showing_user.about}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn class="ml-auto" color="error" text @click="profile.showProfile = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    
</template>

<script>
import UserService from "@/services/user.service"

export default {
    data() {
      return {
        showing_user: {},
        groupModal: false,
      }
    },
    props: ["profile", "show_profile_id", "user"],
    watch: {

      show_profile_id: function() {
        this.getUser()
      }
    },
    mounted() {
      this.getUser()
    },
    methods: {
      viewDetail(msg_user) {
        this.groupModal = true;
        this.msg_user = msg_user;
        this.msg_user.id = this.show_profile_id
        this.$emit('msgModal', {groupModal: this.groupModal, msg_user: this.msg_user})
      },
      async getUser() {

        const data = await UserService.getUserById(this.show_profile_id)
        this.showing_user = data.data
      },
    }
}
</script>
