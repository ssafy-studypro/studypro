<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="9" md="8" sm="12">
        <v-card class="pa-1" outlined tile>
          <study-mini-board />
        </v-card>
      </v-col>

      <v-col lg="3" md="4" class="d-none d-md-block">
        <v-row>
          <!-- <v-card class="pa-1" outlined tile> -->
          <study-profile />
          <!-- </v-card> -->
        </v-row>
        <v-row>
          <!-- <v-card class="pa-1" outlined tile> -->
          <study-todo-list />
          <!-- </v-card> -->
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="pa-1 transparent" outlined tile>
          <middle />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {
    StudyMiniBoard: () =>
      import("@/components/studydetail/groupHome/StudyMiniBoard"),
    StudyTodoList: () =>
      import("@/components/studydetail/groupHome/StudyTodoList"),
    StudyProfile: () =>
      import("@/components/studydetail/groupHome/StudyProfile"),
    Middle: () => import("@/components/home/Middle")
  }
};
</script>
