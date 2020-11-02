<template>
  <div id="contents">
    <v-row class="justify-center">
      <v-col cols="12" sm="10">
        <!-- 검색 창 -->
        <v-autocomplete
          :items="recommendItems"
          :loading="isLoading"
          :search-input.sync="searchInput"
          clearable
          hide-details
          item-text="name"
          item-value="symbol"
          label="이름으로 검색"
          solo
          @keyup.enter="searchEnter()"
          id="study-search"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                찾으실
                <strong>모임이름</strong>
                을 입력해주세요.
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:item="{ item }" @click="selectAuto(item.name)">
            <v-list-item-avatar
              color="indigo"
              class="headline font-weight-light white--text"
              >{{ item.name.charAt(0) }}</v-list-item-avatar
            >
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>people</v-icon>
            </v-list-item-action>
          </template>
        </v-autocomplete>
        <!-- 검색 창 끝 -->
      </v-col>
    </v-row>

    <!-- 상세 검색 -->
    <v-row class="justify-center">
      <v-col cols="12" sm="10" class="px-3 pt-0">
        <v-expansion-panels hover>
          <v-expansion-panel>
            <v-expansion-panel-header class="pl-3"
              >상세검색</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="3">
                  <span>카테고리</span>
                </v-col>
                <v-col cols="9" md="4" class="pa-0">
                  <span class="mr-3">대분류</span>
                  <v-overflow-btn
                    :items="majorItems"
                    v-model="major"
                    segmented
                    dense
                    style="width: 150px; display:inline-block"
                  ></v-overflow-btn>
                </v-col>
                <v-col cols="3" class="d-md-none" />
                <v-col cols="9" md="4" class="pa-0">
                  <span class="mr-3">소분류</span>
                  <v-overflow-btn
                    :items="minorItems"
                    v-model="minor"
                    segmented
                    dense
                    style="width: 150px; display:inline-block"
                  ></v-overflow-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3" class="pt-2">
                  <span>시작날짜</span>
                </v-col>
                <v-col cols="9" class="py-0">
                  <v-menu
                    ref="calendar"
                    v-model="calendar"
                    :close-on-content-click="false"
                    :return-value.sync="searchForm.startdate"
                    transition="scale-transition"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="searchForm.startdate"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                        class="pt-0"
                        hide-details
                        style="max-width:150px"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="searchForm.startdate"
                      no-title
                      scrollable
                      @click:date="$refs.calendar.save(searchForm.startdate)"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row class="pb-2">
                <v-col cols="3">
                  <span>시작/종료시간</span>
                </v-col>
                <v-col cols="7" sm="5" md="3" class="py-0 pr-0">
                  <v-menu
                    ref="startTime"
                    v-model="active.startTime"
                    :close-on-content-click="false"
                    :nudge-right="30"
                    :return-value.sync="searchForm.starttime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="searchForm.starttime"
                        label="시작 시간"
                        prepend-icon="access_time"
                        readonly
                        hide-details
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="searchForm.starttime"
                      full-width
                      header-color="customTheme"
                      ampm-in-title
                      @click:minute="$refs.startTime.save(searchForm.starttime)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="2" md="1" class="text-center">
                  <span>~</span>
                </v-col>
                <v-col cols="3" class="d-md-none"></v-col>
                <v-col cols="7" sm="5" md="3" class="py-0 pl-0 text-end">
                  <v-menu
                    ref="endTime"
                    v-model="active.endTime"
                    :close-on-content-click="false"
                    :nudge-right="30"
                    :return-value.sync="searchForm.endtime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="searchForm.endtime"
                        label="종료 시간"
                        prepend-icon="access_time"
                        readonly
                        hide-details
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="searchForm.endtime"
                      full-width
                      header-color="customTheme"
                      ampm-in-title
                      @click:minute="$refs.endTime.save(searchForm.endtime)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <v-spacer />
              </v-row>

              <v-row>
                <v-col cols="3">
                  <span>요일</span>
                </v-col>
                <v-col cols="9" class="pa-0">
                  <v-btn-toggle
                    v-model="searchForm.dayofweek"
                    multiple
                    dense
                    group
                  >
                    <v-row>
                      <v-btn class="multiplebtn" elevation="0" value="Mon"
                        >Mon</v-btn
                      >
                      <v-btn class="multiplebtn" elevation="0" value="Tue"
                        >Tue</v-btn
                      >
                      <v-btn class="multiplebtn" elevation="0" value="Wed"
                        >Wed</v-btn
                      >
                      <v-btn class="multiplebtn" elevation="0" value="Thu"
                        >Thu</v-btn
                      >
                      <v-btn class="multiplebtn" elevation="0" value="Fri"
                        >Fri</v-btn
                      >
                      <v-btn class="multiplebtn" elevation="0" value="Sat"
                        >Sat</v-btn
                      >
                      <v-btn class="multiplebtn" elevation="0" value="Sun"
                        >Sun</v-btn
                      >
                    </v-row>
                  </v-btn-toggle>
                </v-col>
              </v-row>
              <!-- 카테고리 -->
              <v-row justify="end">
                <v-btn class="mr-2" style="width:80px" @click="detailInit"
                  >초기화</v-btn
                >
                <v-btn class="mr-2" style="width:80px" @click="detailSearch"
                  >검색</v-btn
                >
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- 결과 테이블 -->
    <v-card class="col-12 col-sm-10 offset-sm-1">
      <v-card flat class="mt-2 ml-2">
        <v-icon large class="mr-2" color="black">search</v-icon>
        <span style="font-size: 25px">검색 결과</span>
      </v-card>
      <v-divider v-if="!noResult" class="mt-3 mx-2" />
      <v-content v-if="noResult" class="text-center pt-10">
        <span>검색 대상을 찾지 못했습니다.</span>
      </v-content>
      <v-card outlined>
        <v-list
          v-infinite-scroll="loadMore"
          :infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
        >
          <v-list-group
            v-for="item in displayItems"
            :key="item.id"
            v-model="item.active"
            :prepend-icon="item.action"
            :disabled="isLoading"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" md="5" class="pl-3 text-center">
                    <v-list-item-title
                      v-text="item.name"
                      class="text-overflow"
                    ></v-list-item-title>
                  </v-col>
                  <v-col cols="6" sm="4" md="2" class="text-center">
                    <span>{{ item.process_days | filterDays }}</span>
                  </v-col>
                  <v-col cols="6" sm="4" md="2" class="text-center">
                    <span>
                      {{ item.start_time | times }} ~
                      {{ item.end_time | times }}
                    </span>
                  </v-col>
                  <v-col cols="6" sm="2" md="2" class="text-center">
                    <span>
                      {{ item.num_joined_student }}/{{
                        item.user_limit | limit
                      }}
                    </span>
                  </v-col>
                  <v-col
                    cols="6"
                    sm="2"
                    md="1"
                    class="text-center pr-3"
                    v-if="item.isopen"
                  >
                    <v-icon class="mdi mdi-lock"></v-icon>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </template>
            <v-divider />
            <v-divider />
            <!-- 펼쳤을 때 화면 -->
            <template>
              <v-layout class="ma-2" row>
                <v-list-item :key="item.id">
                  <v-list-item-content class="pt-0 pb-1 d-block">
                    <v-row class="px-2">
                      <!-- 내용 -->
                      <v-col cols="12" md="9">
                        <!-- 카테고리 -->
                        <v-row>
                          <v-col cols="4">
                            <span class="font-weight-bold">카테고리</span>
                          </v-col>
                          <v-divider vertical class="mr-2" />
                          <v-col cols="7">{{ item.minor_class.name }}</v-col>
                        </v-row>
                        <!-- 현재상태 -->
                        <v-row>
                          <v-col cols="4">
                            <span class="font-weight-bold">상태</span>
                          </v-col>
                          <v-divider vertical class="mr-2" />
                          <v-col cols="7">{{ item.status }}</v-col>
                        </v-row>
                        <!-- 스터디 소개글 -->
                        <v-row>
                          <v-col cols="4">
                            <span class="font-weight-bold">스터디 목표</span>
                          </v-col>
                          <v-divider vertical class="mr-2" />
                          <v-col cols="7">{{ item.goal }}</v-col>
                        </v-row>
                        <!-- 시작시간 -->
                        <v-row>
                          <v-col cols="4">
                            <span class="pt-0 font-weight-bold">시작날짜</span>
                          </v-col>
                          <v-divider vertical class="mr-2" />
                          <v-col cols="7">{{ item.start_date }}</v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="4">
                            <span class="pt-0 font-weight-bold">종료날짜</span>
                          </v-col>
                          <v-divider vertical class="mr-2" />
                          <v-col cols="7">{{ item.end_date }}</v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                        md="3"
                        class="justify-center align-center pa-0"
                      >
                        <v-btn
                          class="white lighten-3"
                          elevation="0"
                          @click="grpModal(item)"
                        >
                          <span
                            class="dark--text"
                            style="text-decoration:underline;"
                            >view detail</span
                          >
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-layout>
              <v-divider />
              <v-divider />
            </template>
          </v-list-group>
        </v-list>
      </v-card>
    </v-card>
    <group-modal
      :group-modal="groupModal"
      :study-info="modalItem"
      v-on:close="modalClose"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    isLoading: false,
    searchInput: null,
    tab: null,
    busy: false,
    groupModal: false,
    calendar: false,
    durationOp: "",
    itemsDuration: ["Day", "Week", "Month", "Year"],
    searchForm: {
      startdate: "",
      starttime: "",
      endtime: "",
      dayofweek: []
    },
    items: [],
    copyItems: [],
    recommendItems: [],
    displayItems: [],
    searchedItems: [],
    disLoading: false,
    noResult: false,
    major: -1,
    minor: -1,
    majorItems: [],
    minorItems: [],
    active: {
      startTime: false,
      endTime: false
    },
    modalItem: {
      captain: {
        nickname: "",
        about: null
      },
      process_days: [],
      start_time: "",
      end_time: "",
      start_date: "",
      end_date: "",
      description: "",
      goad: "",
      name: "",
      num_joined_student: 0,
      user_limit: 0,
      status: "",
      image_url: "",
      minor_class: {
        name: ""
      }
    }
  }),
  props: ["id"],
  components: {
    GroupModal: () => import("@/components/study/GroupModal")
  },
  watch: {
    searchInput() {
      this.recommendItems = [];

      if (!this.searchInput) {
        return;
      } else {
        for (var item of this.items) {
          if (item.name.includes(this.searchInput)) {
            this.recommendItems.push(item);
          }
        }
      }
    },
    async major() {
      this.minorItems = [];

      const minor_classes = await this.$store.dispatch(
        "study/getMinorClass",
        this.major
      );
      for (let i = 0; i < minor_classes.length; i++) {
        this.minorItems.push({
          value: minor_classes[i].id,
          text: minor_classes[i].name,
          callback: () => {}
        });
      }
    }
  },
  methods: {
    async loadDeaultList() {
      this.items = await this.$store.dispatch("study/getAllStudy");
      this.copyItems = this.items.slice(0);

      this.displayItems = [];
      let len = this.copyItems.length < 10 ? this.copyItems.length : 10;
      for (var i = 0; i < len; i++) {
        this.displayItems.push(this.copyItems.shift());
      }
    },

    async loadMore() {
      this.busy = true;
      let len = (this.copyItems.length < 10)? this.copyItems.length:10;
      await setTimeout(() => {
        for (var i = 0; i < len; i++) {
          let insert = this.copyItems.shift()
          if(insert){
            this.displayItems.push(insert);
          }
        }
      }, 500);

      this.busy = false;
    },

    async searchEnter() {
      this.busy = true;
      this.displayItems = [];
      this.noResult = false;
      this.copyItems = [];
      if (!this.searchInput) {
        await this.loadDeaultList();
        this.busy = false;
        return;
      } else {
        for (var item of this.items) {
          if (item.name.includes(this.searchInput)) {
            this.copyItems.push(item);
          }
        }
        let len = this.copyItems.length < 20 ? this.copyItems.length : 20;
        for (var i = 0; i < len; i++) {
          this.displayItems.push(this.copyItems.shift());
        }
      }
      this.searchInput = "";
      if (this.displayItems.length == 0) {
        this.noResult = true;
      }
      this.busy = false;
    },

    selectAuto(name) {
      this.searchInput = name;
    },

    modalClose() {
      this.groupModal = false;
    },

    detailSearch() {
      this.busy = true;
      this.displayItems = [];
      this.copyItems = [];
      this.noResult = false;
      for (var item of this.items) {
        if (this.checkItems(item, this.searchForm)) {
          this.copyItems.push(item);
        }
      }
      let len = this.copyItems.length < 20 ? this.copyItems.length : 20;
      for (var i = 0; i < len; i++) {
        this.displayItems.push(this.copyItems.shift());
      }
    },

    checkItems(item, input) {
      // 이름 검사
      if (this.searchInput && item.name.includes(this.searchInput)) {
        return false;
      }
      // 대분류 검사
      if (this.major != -1 && item.minor_class.major_class_id != this.major) {
        return false;
      }
      // 소분류 검사
      if (this.minor != -1 && item.minor_class.id == this.minor) {
        return false;
      }
      // 시작날짜 검사
      if (
        input.startdate != "" &&
        this.isLaterLeftDate([
          { date: input.startdate },
          { date: item.start_date }
        ])
      ) {
        return false;
      }
      // 시작시간 검사
      if (
        input.starttime != "" &&
        this.isLaterLeftTime([
          { time: input.starttime },
          { time: item.start_time }
        ])
      ) {
        return false;
      }
      //종료시간 검사
      if (
        input.endtime != "" &&
        this.isLaterLeftTime([{ time: item.end_time }, { time: input.endtime }])
      ) {
        return false;
      }
      // 요일 검사
      if (this.compareDays(item.process_days, input.dayofweek)) {
        return false;
      }
      return true;
    },

    isLaterLeftDate(days) {
      for (var d of days) {
        var arr = d.date.split("-");
        d.year = arr[0];
        d.month = arr[1];
        d.day = arr[2];
      }
      if (days[0].year > days[1].year) {
        return true;
      }

      if (days[0].year == days[1].year && days[0].month > days[1].month) {
        return true;
      }
      if (days[0].month == days[1].month && days[0].day > days[1].day) {
        return true;
      }
      return false;
    },

    isLaterLeftTime(times) {
      for (var t of times) {
        if (typeof t.time == "number") {
          t.hour = Math.floor(t.time / 100);
          t.minute = t.time % 100;
        } else {
          t.hour = t.time.split(":")[0];
          t.minute = t.time.split(":")[1];
        }
      }

      if (times[0].hour > times[1].hour) {
        return true;
      }

      if (times[0].hour == times[1].hour && times[0].minute > times[1].minute) {
        return true;
      }

      return false;
    },

    compareDays(item, input) {
      for (var input_day of input) {
        var notMatching = true;
        for (var item_day of item) {
          if (input_day == item_day.day) {
            notMatching = false;
            break;
          }
        }

        if (notMatching) {
          return true;
        }
      }
    },

    detailInit() {
      this.searchForm = {
        name: "",
        startdate: "",
        starttime: "",
        endtime: "",
        dayofweek: []
      };
      this.major = -1;
      this.minor = -1;
      this.searchInput = "";
    },

    grpModal(item) {
      this.groupModal = true;
      this.modalItem = item;
    }
  },
  filters: {
    times(value) {
      let hour = Math.floor(value / 100);
      let minute = value % 100;
      if (hour < 10) hour = "0" + hour;
      if (minute < 10) minute = "0" + minute;
      return hour + ":" + minute;
    },
    limit(value) {
      if (value == 0) {
        return "-";
      }
      return value;
    },

    filterDays(value) {
      if (value.length == 1 && value[0].day == "") {
        return "-";
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
    }
  },
  async mounted() {
    this.majorItems = [];
    const getMajorRes = await this.$store.dispatch("study/getMajorClass"); //await api.getMajorClasses();
    
    for (let i = 0; i < getMajorRes.length; i++) {
      this.majorItems.push({
        value: getMajorRes[i].id,
        text: getMajorRes[i].name,
        callback: () => {}
      });
    }
    await this.loadDeaultList();
  }
};
</script>

<style>
.v-text-field__details {
  display: none;
}
.v-list-item__icon {
  min-width: 24px !important;
}

.multiplebtn {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
