<template>
  <v-content class="pa-0">
    <!-- <v-form> -->

    <v-card class="mx-auto" max-width="1500">
      <v-toolbar flat color="customTheme" dark>
        <v-toolbar-title class="ml-5">신설 스터디</v-toolbar-title>
      </v-toolbar>

      <v-row>
        <v-col>
          <!-- <div class="tabs"> -->

          <v-slide-group
            v-if="current === 'ng'"
            class="pa-4"
            multiple
            show-arrows
          >
            <v-slide-item v-for="studyInfo in studyList" :key="studyInfo.id">
              <v-card
                color="white"
                class="ma-4"
                height="auto"
                width="200"
                @click="viewDetail(studyInfo)"
                ><div style="position:absolute; width:100%; height:100%;">
                  <v-img
                    class="white--text align-end"
                    style="opacity:0.5;z-index:0"
                    height="100%"
                    :src="studyInfo.image_url"
                  ></v-img>
                </div>
                <v-row class="mb-8">
                  <v-card-title
                    class="pl-8 cardText blink"
                    style="font-size:15px; color:blue;"
                    >{{ studyInfo.status }}!</v-card-title
                  >
                </v-row>

                <v-row class="pt-4" justify="center">
                  <v-avatar size="70" class="mr-2">
                    <v-img
                      style="border: 3px solid #ffffff"
                      :src="studyInfo.captain.profile_url"
                    >
                    </v-img>
                  </v-avatar>
                </v-row>

                <!-- <div class="blink"><span>blinking text</span></div> -->
                <v-row justify="center">
                  <v-card-title
                    class="cardText"
                    style="font-size:30px;font-weight: 700;"
                    ><span>{{ studyInfo.name }}</span></v-card-title
                  >
                </v-row>
                <v-row justify="center">
                  <v-card-title
                    class="py-0 cardText"
                    style="font-size:20px; text-decoration:underline solid rgb(0,0,0);"
                    >{{ studyInfo.minor_class.name }}</v-card-title
                  >
                </v-row>
                <v-row justify="center">
                  <v-card-title class="py-0 cardText" style="font-size:15px">
                    시간 : {{ studyInfo.start_time }} -
                    {{ studyInfo.end_time }}시
                  </v-card-title>
                </v-row>
                <v-row justify="center">
                  <v-card-title class="pt-0 cardText" style="font-size:15px">
                    <div v-if="studyInfo.user_limit"> 
                      현재 인원 : {{studyInfo.num_joined_student}} / {{ studyInfo.user_limit }}
                    </div> 
                    <div v-else> 
                      인원제한 없음
                    </div>
                  </v-card-title>
                </v-row>
              </v-card>
            </v-slide-item>
            <template>
              <group-modal
                :group-modal="groupModal"
                :study-info="studySingle"
                v-on:close="modalClose"
              />
            </template>
          </v-slide-group>
          <!-- </div> -->
        </v-col>
      </v-row>
    </v-card>
    <!-- </v-form> -->
  </v-content>
  <!-- </v-container> -->
</template>

<script>
import StudyService from "@/services/study.service";

export default {
  name: "tabs",
  data: () => ({
    current: "ng",

    studyList: [],
    studySingle: null,

    groupModal: false,
    item: {},
    items: []
  }),
  async created() {
    this.studyList = await StudyService.getAllStudy();
  },
  computed: {
    isAuth: function() {
      return this.$store.getters.isAuth;
    }
  },
  components: {
    GroupModal: () => import("@/components/study/GroupModal")
  },
  methods: {
    tabSwitch(target) {
      this.current = target;
    },
    viewDetail(studyInfo) {
      //console.log("viewde", studyInfo);
      this.groupModal = true;
      this.studySingle = studyInfo;
    },
    modalClose() {
      this.groupModal = false;
    },
  }
};
</script>

<style>
.blink {
  width: 200px;
  height: 50px;
  padding: 15px;
  text-align: center;
  line-height: 50px;
  font-size: 25px;
  /* font-family: cursive; */
  color: white;
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
#istudyname {
  color: blue;
  font-size: 25px;
  font-weight: 700;
}
#istudytopic {
  color: #24ccff;
  font-size: 20px;
  text-decoration: underline;
}
.cardText {
  z-index: 1 !important;
}
</style>
