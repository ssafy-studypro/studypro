<template>
<section class="container fill-width">
  <v-row class="justify-center">
    <!-- 통계1 -->
    <v-col class="d-flex col-sm-6 col-md-3 col-6 justify-center">
      <v-card 
        class="mx-auto pt-3 pb-4 px-2 text-center statecard1"
        min-width="100%"
        elevation=5>
        <v-icon
          class="mdi mdi-account-circle"
          style="font-size: 64px;"
          color="white"
          ></v-icon>
        <v-card-title
          class="headline red--text lighten-1 justify-center">
          Visitors
        </v-card-title>
        <v-card-subtitle class="white--text"><br>
          Display
        </v-card-subtitle>
      </v-card>
    </v-col>
    
    <!-- 통계2 -->
    <v-col class="d-flex col-sm-6 col-md-3 col-6 justify-center">
      <v-card 
        class="mx-auto pt-3 pb-4 px-2 text-center statecard2"
        min-width="100%"
        elevation=5>
        <v-icon
          class="mdi mdi-account-circle"
          style="font-size: 64px;"
          color="white"
          ></v-icon>
        <v-card-title
          class="headline blue--text lighten-1 justify-center">
          Visitors
        </v-card-title>
        <v-card-subtitle class="white--text"><br>
          Display
        </v-card-subtitle>
      </v-card>
    </v-col>

    <!-- 통계3 -->
    <v-col class="d-flex col-sm-6 col-md-3 col-6 justify-center">
      <v-card 
        class="mx-auto pt-3 pb-4 px-2 text-center statecard3"
        min-width="100%"
        elevation=5>
        <v-icon
          class="mdi mdi-account-circle"
          style="font-size: 64px;"
          color="white"
          ></v-icon>
        <v-card-title
          class="headline orange--text lighten-1 justify-center">
          Visitors
        </v-card-title>
        <v-card-subtitle class="white--text"><br>
          Display
        </v-card-subtitle>
      </v-card>
    </v-col>

    <!-- 통계4 -->
    <v-col class="d-flex col-sm-6 col-md-3 col-6 justify-center">
      <v-card 
        class="mx-auto pt-3 pb-4 px-2 text-center statecard4"
        min-width="100%"
        elevation=5>
        <v-icon
          class="mdi mdi-account-circle"
          style="font-size: 64px;"
          color="white"
          ></v-icon>
        <v-card-title
          class="headline yellow--text lighten-1 justify-center">
          Visitors
        </v-card-title>
        <v-card-subtitle class="white--text"><br>
          Display
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</section>
</template>

<script>
export default {
};
</script>

<style>
.statecard1{
    background: -webkit-linear-gradient(to right, #000000, #D76D77, #3A1C71);
    background: linear-gradient(to bottom right, #000000, #111111, #666666);
}
.statecard2{
    background: -webkit-linear-gradient(to right, #000000, #D76D77, #3A1C71);
    background: linear-gradient(to bottom right, #ec0303, #e95f5f, #666666);
}
.statecard3{
    background: -webkit-linear-gradient(to right, #000000, #D76D77, #3A1C71);
    background: linear-gradient(to bottom right, #067c06, #1eb611, #666666);
}
.statecard4{
    background: -webkit-linear-gradient(to right, #000000, #D76D77, #3A1C71);
    background: linear-gradient(to bottom right, #0a1577, #4c32be, #666666);
}
</style>
