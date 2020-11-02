<template>
  <v-container id="createSuccess" style="height:400px" class="pt-0">
        <v-row justify="center" align="center" style="height:100%">
          <v-col cols="9" class="text-center">
            <span class="display-2 font-weight-thin">Study</span>
            <span class="display-2">PRO</span>
            <p class="mt-5">모임이 생성되었습니다.</p>
            <v-btn text class="mr-4" color="primary" @click="moveg">가입된 그룹목록 가기</v-btn>
            <v-btn text class="mr-4" color="error" @click="moved">생성그룹상세로 가기</v-btn>
          </v-col>
        </v-row>
  </v-container>
</template>

<script>
export default {
  name: "createSuccess",
  props:['movegroups', 'id'],
  methods: {
    moveg(){
        this.$emit('movegroups')
    },
    moved(){
        this.$router.push({ path: `${this.id}`+'/home' });
    }
  },
};
</script>
