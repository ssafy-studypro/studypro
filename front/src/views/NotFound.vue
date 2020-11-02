<template>
  <v-content id="error">
    <v-row no-gutters justify="center">
      <v-col cols="10">
        <v-card outlined>
          <v-row no-gutters style="height:100%" align="center" justify="center">
            <v-col cols="5">
              <v-img src="@/assets/Failure.jpg" style="width: 100vh"></v-img>
            </v-col>
            <v-col cols="7">
              <v-card flat align="center" style="width: 100%; height: 100%">
                    <p>page not found</p>
                <p>요청하신 페이지를 찾을 수 없습니다...</p>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {};
</script>

<style scoped>
</style>