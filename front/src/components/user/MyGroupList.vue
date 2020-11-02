<template>
  <v-card class="mx-4" tile min-height="450px" elevation="0">
    <v-card-title>
      내 스터디 보기
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="그룹명으로 검색" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-row>
      <v-col class="text-end">
        <v-btn text v-show="selected.length > 0" class="error--text">탈퇴</v-btn>
        <v-btn text @click="loadItems">목록 갱신</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :search="search"
      @click:row="clicked($event)"
    >
      <v-alert
        slot="no-results"
        icon="warning"
        class="ma-0"
      >Your search for "{{ search }}" found no results.</v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
import UserService from "@/services/user.service";

export default {
  components: {},
  data: () => ({
    expanded: [],
    singleExpanded: true,
    selected: [],
    clickedItems: [],
    search: "",
    headers: [
      { text: "카테고리", align: "center", value: "category" },
      { text: "그룹명", align: "center", value: "name" },
      { text: "시간", align: "center", value: "time" },
      { text: "요일", align: "center", sortable: false, value: "days" },
      { text: "상태", align: "center", value: "status" },
      { text: "인원", align: "center", sortable: false, value: "member" }
    ],
    items: [
      {
        category: "",
        name: "",
        time: "",
        days: "",
        status: "",
        member: "",
        id: 0
      }
    ]
  }),
  watch: {
    isAuth() {
      this.loadItems();
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    }
  },
  methods: {
    clicked(event) {
      this.$router.push({ name: "study_home", params: { study_id: event.id } });
    },
    getTime(start, end) {
      var s_hour = Math.floor(start / 100);
      var s_minute = start % 100;
      var e_hour = Math.floor(end / 100);
      var e_minute = end % 100;
      if (s_minute < 10) s_minute = "0" + s_minute;
      if (e_minute < 10) e_minute = "0" + e_minute;
      return s_hour + ":" + s_minute + " ~ " + e_hour + ":" + e_minute;
    },

    async loadItems() {
      var items = await UserService.getMyGroups();
      //리스트 정제
      this.items = [];
      for (var item of items) {
        var tmp = {
          id: item.id,
          category: item.minor_class.name,
          name: item.name,
          time: this.getTime(item.start_time, item.end_time),
          days: this.getDays(item.process_days),
          status: item.status,
          membership_level: item.membership_level,
          image_url: item.image_url,
          member: this.getMember(item.num_joined_student, item.user_limit)
        };
        this.items.push(tmp);
      }
    },

    getDays(process_days) {
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
      for(var d of process_days){
        days += weekofdays[d.day] + ' '
      }
      return days;
    },

    getMember(join, limit) {
      if (limit == 0) {
        return join + " / ∞";
      } else {
        return join + " / " + limit;
      }
    }
  },
  async mounted() {
    this.loadItems();
  }
};
</script>

<style>
p {
  font-size: 30px;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: rgba(200, 200, 200, 0.2);
}
td.text-center {
  cursor: pointer;
}
</style>
