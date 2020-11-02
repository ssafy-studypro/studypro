<template>
  <div id="topleft">
    <div v-if="isExistMyGroup">
      <p class="main-title pl-8 pt-5 animated fadeIn slow">나의 모임</p>
      <v-row class="mx-auto">
        <v-col
          cols="6"
          sm="4"
          md="3"
          v-for="item in myStudyList"
          :key="item.id"
        >
          <v-card
            elevation="1"
            max-width="300px"
            class="animated fadeInRight card slow"
            :style="getStyle(item.order)"
            @click="viewDetail(item)"
          >
            <v-img :src="item.image_url" class="studyCardImg"></v-img>
            <v-card-title class="card-title"
              ><p class="ellipsis">{{ item.name }}</p>
            </v-card-title>
            <v-card-text class="card-text">
              <span>
                <small>by {{ item.captain.name }} </small><br />
                <small
                  >{{ item.start_time | getTime }} ~
                  {{ item.end_time | getTime }}</small
                >
                / <small>{{ item.process_days | getDays }}</small>
              </span>
              <span class="ellipsis">
                <v-icon>emoji_flags</v-icon>{{ item.goal }}
              </span>
              <span class="ellipsis-multi mb-0">
                {{ item.description }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div style="height:5%"></div>
    <v-lazy
          :options="{
            threshold: 0.5
          }"
          transition="fade-transition"
        >
    <p class="main-title pl-8 pt-5 animated fadeIn slow">새로운 모임</p>
    </v-lazy>
    <v-row class="mx-auto">
      <v-col cols="6" sm="4" md="3" v-for="item in studyList" :key="item.id">
        <v-lazy
          :options="{
            threshold: 0.5
          }"
          transition="fade-transition"
        >
          <v-card
            elevation="1"
            max-width="300px"
            class="animated fadeInRight card slow"
            :style="getStyle(item.order)"
            @click="viewDetail(item)"
          >
            <v-img :src="item.image_url" class="studyCardImg"></v-img>
            <v-card-title class="card-title"
              ><p class="ellipsis">{{ item.name }}</p>
            </v-card-title>
            <v-card-text class="card-text">
              <span>
                <small>by {{ item.captain.name }} </small><br />
                <small
                  >{{ item.start_time | getTime }} ~
                  {{ item.end_time | getTime }}</small
                >
                / <small>{{ item.process_days | getDays }}</small>
              </span>
              <p class="ellipsis mb-2">
                <v-icon>emoji_flags</v-icon>{{ item.goal }}
              </p>
              <p class="ellipsis-multi mb-0">
                {{ item.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
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
      if (value.length == 1) {
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

.studyCardImg {
  height: 140px;
  width: auto;
}

.card {
  border: 2px !important;
}
</style>
