<template>
  <div id="top">
    <div v-if="isExistMyGroup">
      <!-- 가입한 모임 목록 -->
      <p class="main-title animated fadeIn" aria-disabled>
        나의 모임
      </p> 
      <v-row>
        <v-col
          cols="6"
          sm="4"
          md="3"
          v-for="item in myStudyList"
          :key="item.id"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card
              elevation="1"
              class="animated fadeInRight card"
              :style="getStyle(item.order)"
              @click="moveDetail(item)"
            >
              <v-row class="card-img-container" align="center">
                <v-col class="py-0">
                  <v-img
                    :src="item.image_url"
                    class="card-img"
                    align="center"
                  ></v-img>
                </v-col>
              </v-row>
              <div class="card-text">
                <small>{{ item.minor_class.name }}</small>
                <p class="card-title">
                  {{ item.name }}
                </p>
              </div>
              <!-- 오버랩 카드 -->
              <div
                v-if="hover"
                class="animated fadeIn card-overlap card-text mx-auto"
              >
                <p class="card-title">
                  {{ item.name }}
                </p>
                <p class="card-small-text card-des-ellipsis">
                  {{ item.description }}
                </p>
                <small class="card-small-text font-weight-thin"
                  >{{ item.start_time | getTime }} ~ {{ item.end_time | getTime
                  }}<br />{{ item.process_days | getDays }}</small
                >
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <!-- 가입한 모임목록 끝 -->
    <div style="height:5%"></div>

    <!-- 새로운 모임 목록 -->
    <v-lazy
      :options="{
        threshold: 0.5
      }"
    >
      <p class="main-title animated fadeIn" aria-disabled>
        새로운 모임
      </p>
    </v-lazy>
    <v-row>
      <v-col cols="6" sm="4" md="3" v-for="item in studyList" :key="item.id">
        <v-hover v-slot:default="{ hover }">
          <v-lazy
            :options="{
              threshold: 0.5
            }"
            transition="slide-x-transition"
          >
            <v-card
              elevation="1"
              class="animated fadeInRight card shrink"
              :style="getStyle(item.order)"
              @click="viewDetail(item)"
            >
              <v-row class="card-img-container" align="center">
                <v-col class="py-0">
                  <v-img
                    :src="item.image_url"
                    class="card-img"
                    align="center"
                  ></v-img>
                </v-col>
              </v-row>
              <div class="card-text">
                <small>{{ item.minor_class.name }}</small>
                <p class="card-title">
                  {{ item.name }}
                </p>
              </div>
              <!-- 오버랩 카드 -->
              <div
                v-if="hover"
                class="animated fadeIn card-overlap card-text mx-auto"
              >
                <p class="card-title">
                  {{ item.name }}
                </p>
                <p class="card-small-text card-des-ellipsis">
                  {{ item.description }}
                </p>
                <small class="card-small-text font-weight-thin"
                  >{{ item.start_time | getTime }} ~ {{ item.end_time | getTime
                  }}<br />{{ item.process_days | getDays }}</small
                >
              </div>
            </v-card>
          </v-lazy>
        </v-hover>
      </v-col>
    </v-row>
    <!-- 새로운 모임목록 끝 -->
    <group-modal
      :study-info="studySingle"
      :group-modal="groupModal"
      v-on:close="modalClose"
    />
  </div>
</template>

<script>
import StudyService from "@/services/study.service";
import UserService from "@/services/user.service";
export default {
  data: () => ({
    isActive: false,
    studyList: [],
    studySingle: {
      name: "",
      minor_class: {
        name: ""
      },
      status: "",
      num_joined_student: 0,
      user_limit: 0,
      goal: "",
      description: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      captain: {
        nickname: "",
        about: ""
      }
    },
    groupModal: false,
    myStudyList: []
  }),
  watch: {
    async isAuth() {
      if (this.isAuth) {
        this.myStudyList = await UserService.getMyGroups();
      } else {
        this.myStudyList = [];
      }
    }
  },
  async created() {
    this.studyList = [];
    if (this.isAuth) {
      this.myStudyList = await UserService.getMyGroups();
    }
    var list = await StudyService.getAllStudy();
    var len = list.length < 8 ? list.length : 8;
    for (var i = 0; i < len; i++) {
      this.studyList.push(list.shift());
      this.studyList[i].order = i;
    }
  },
  mounted() {
    this.isActive = false;
  },
  components: {
    GroupModal: () => import("@/components/study/GroupModal")
  },
  methods: {
    viewDetail(studyInfo) {
      this.studySingle = studyInfo;
      this.groupModal = true;
    },
    moveDetail(studyInfo) {
      this.$router.push({ path: 'study/' + studyInfo.id + '/home'});
    },
    modalClose() {
      this.groupModal = false;
    },
    getStyle(order) {
      var styleObject = {
        "-webkit-animation-delay": "." + order + "s",
        "animation-delay": "." + order + "s"
      };

      return styleObject;
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    },
    isExistMyGroup() {
      if (this.myStudyList.length > 0) {
        return true;
      }
      return false;
    }
  },
  filters: {
    getDays(value) {
      if (value.length == 1 && value[0].day == "") {
        return value[0].day;
      }
      var days = "";
      var weekofdays = {
        Mon: "월",
        Tue: "화",
        Wed: "수",
        Thu: "목",
        Fri: "금",
        Sat: "토",
        Sun: "일"
      };
      for (var i = 0; i < value.length; i++) {
        days += weekofdays[value[i].day] + " ";
      }

      return days;
    },
    getTime(value) {
      var hour = Math.floor(value / 100);
      if (hour < 10) hour = "0" + hour;
      var minute = value % 100;
      if (minute < 10) minute = "0" + minute;
      return hour + ":" + minute;
    }
  }
};
</script>

<style>
#topleft {
  height: 100%;
}
</style>
