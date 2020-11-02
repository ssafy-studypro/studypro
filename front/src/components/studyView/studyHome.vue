<template>
  <v-card flat class="pa-0">
    <v-row no-gutters class="pt-2">
      <v-spacer />
      <v-col cols="9" class="pl-4">
        <v-card flat>
          <study-mini-board :study_id="this.study_id" />
          <v-divider class="mx-5"/>
          <v-card flat class="mx-3">
            <study-todo-list :study_id="this.study_id" />
          </v-card>
        </v-card>
      </v-col>

      <v-spacer />
      <v-col cols="3" class="l-1">
        <v-row no-gutters>
          <v-col>
            <v-card flat>
              <study-profile @closeChild="closeChild" @toWorkspace="toWorkspace" :study_id="this.study_id" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer />
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: ["study_id"],
  components: {
    StudyMiniBoard: () =>
      import("@/components/studyView/module/StudyMiniBoard"),
    StudyTodoList: () => import("@/components/studyView/module/StudyTodoList"),
    StudyProfile: () => import("@/components/studyView/module/StudyProfile")
  },
  methods: {
    toWorkspace() {
      this.$emit('toWorkspace')
    },
    closeChild() {
      this.$emit('closeChild')
    }
  }
};
</script>

