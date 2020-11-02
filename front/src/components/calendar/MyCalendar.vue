<template>
  <div id="mycal">
    <v-img src="@/assets/images/banner/calendar.png" />
    <div id="cal-content" v-if="isAuth">
      <!-- 달력 -->
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat color="white">
              <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
              >
                오늘날짜로
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                class="customTheme mr-2 pa-0"
                elevation="0"
                @click="loadAddModal()"
              >
                <span class="white--text px-2">+</span>
                <span class="pr-2 white--text d-none d-sm-flex">일정추가</span>
              </v-btn>
              <v-menu bottom right>
                <template v-slot:activator="{ on }">
                  <v-btn outlined color="grey darken-2" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>일</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>주</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>월</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4일</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>

          <!-- 달력 메인 -->
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :value="today"
              :now="today"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-y
              :nudge-right="30"
              max-width="500px"
              min-width="350px"
            >
              <v-card color="grey lighten-4" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <div>
                    <v-btn icon class="dropPanel" @click="detail = !detail">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    <div
                      :class="{ menu: detail }"
                      class="detaildrop"
                      style="position:absolute"
                    >
                      <ul class="pl-0">
                        <li v-for="item in detailMenus" :key="item.title">
                          <v-btn
                            text
                            @click="clickDetailMenu(item.value, selectedEvent)"
                          >
                            <span style="color:black">{{ item.title }}</span>
                          </v-btn>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <v-dialog
                    v-model="delOpen"
                    max-width="400px"
                    style="overflow:hidden"
                  >
                    <v-card class="py-2 px-3">
                      <p>정말 삭제하시겠습니까?</p>
                      <v-row justify="end">
                        <v-btn
                          text
                          color="dark lighten-2"
                          @click="delOpen = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="error"
                          @click="eventDelete(selectedEvent)"
                        >
                          Ok
                        </v-btn>
                      </v-row>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
                <v-card-text>
                  <p
                    v-text="selectedEvent.start + ' ~ ' + selectedEvent.end"
                    class="text-center"
                  ></p>
                  <span v-html="selectedEvent.content"></span>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="secondary" @click="selectedOpen = false">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
      <add-modal
        :add-modal="addModal"
        :is-update="isUpdate"
        :prop-event="propEvent"
        v-on:close="(addModal = false), (isUpdate = false)"
        v-on:reload="reload"
      />
    </div>
    <request-signin v-else />
  </div>
</template>

<script>
import { format } from "date-fns";
import WorkService from "@/services/work.service";

export default {
  name: "mycal",
  data: () => ({
    today: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
    focus: "",
    type: "month",
    typeToLabel: {
      month: "월",
      week: "주",
      day: "일",
      "4day": "4일"
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    propEvent: {},
    isUpdate: false,
    addModal: false,
    detail: false,
    detailMenus: [
      { title: "일정수정", value: "update" },
      { title: "삭제", value: "delete" }
    ],
    delOpen: false,
    tableHeaders: [
      { text: "그룹명", align: "center", value: "group" },
      { text: "일정명", align: "center", value: "name" },
      { text: "내용", align: "start", sortable: false, value: "content" },
      { text: "날짜", align: "start", value: "date" },
      { text: "시간", align: "start", value: "time" }
    ]
  }),
  components: {
    AddModal: () => import("./AddModal"),
    requestSignin: () => import("@/components/base/RequestSignin")
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year + "년";
      const endYear = end.year + "년";
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + "일";
      const endDay = end.day + "일";

      switch (this.type) {
        case "month":
          return `${startYear} ${startMonth}`;
        case "week":
        case "4day":
          return `${startYear} ${startMonth} ${startDay} ~ ${suffixYear} ${suffixMonth} ${endDay}`;
        case "day":
          return `${startYear} ${startMonth} ${startDay}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    }
  },
  mounted() {
    this.reload();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      this.propEvent = event;
      this.selectedElement = nativeEvent.target;
      this.isUpdate = true;
      this.addModal = true;
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },

    loadAddModal() {
      this.isUpdate = false;
      this.addModal = true;
    },

    async reload() {
      this.events = [];
      let res = await WorkService.getWorks({ type: "personal" });
      for (let item of res) {
        if (item.dates.length == 0) continue;
        item.dates = this.datesToList(item.dates);
        for (let date of item.dates) {
          let copy = JSON.parse(JSON.stringify(item));
          copy.start = date + " " + copy.start_time;
          copy.end = date + " " + copy.end_time;
          copy.color = copy.study_id ? "redC" : "primary";
          this.events.push(copy);
        }
      }

      this.$refs.calendar.checkChange();
    },

    clickDetailMenu(value, event) {
      console.log("clickDetailMenu Method in MyCalendar.vue");

      switch (value) {
        case "update":
          this.loadAddModal(event);
          break;
        case "delete":
          this.delOpen = true;
          break;
        default:
          console.log("clickDetailMenu Error");
      }
    },

    eventDelete(event) {
      WorkService.deleteWork({ type: "personal", work_id: event.id });
      //console.log("eventDelete in MyCalendar.vue", event);
      const eventsIdx = this.events.indexOf(event);
      //삭제 엑시오스 요청
      this.events.splice(eventsIdx, 1);
      this.delOpen = false;
      this.selectedOpen = false;
      this.$refs.calendar.checkChange();
    },

    datesToList(dates) {
      if (dates == "") return [];
      let result = [];
      let arr = dates.split("/");
      if (arr.length == 1) return [dates];

      for (let date of arr) {
        result.push(date);
      }
      return result;
    }
  }
};
</script>
