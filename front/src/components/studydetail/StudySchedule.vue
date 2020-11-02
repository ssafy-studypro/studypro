<template>
  <div id="mycal">
    <div v-if="!isAuth">
      <v-row class="fill-height" justify="center">
        <v-col cols="11" class="mx-2">
          <v-card class="py-0">
            <v-toolbar flat class="d-block d-sm-none">
              <v-spacer></v-spacer>
              <v-btn
                class="customTheme mr-2 pa-0"
                elevation="0"
                @click="loadAddModal()"
              >
                <span class="white--text px-2">+</span>
                <span class="white--text pr-2">일정추가</span>
              </v-btn>
            </v-toolbar>

            <!-- 달력 -->
            <v-row class="fill-height pt-0">
              <v-col class="pt-0">
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
                      class="customTheme mr-2 pa-0 d-none d-sm-flex"
                      elevation="0"
                      @click="loadAddModal()"
                    >
                      <span class="white--text px-2">+</span>
                      <span class="white--text pr-2">일정추가</span>
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
                          <v-btn
                            icon
                            class="dropPanel"
                            @click="detail = !detail"
                          >
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
                                  @click="
                                    clickDetailMenu(item.value, selectedEvent)
                                  "
                                >
                                  <span style="color:black">{{
                                    item.title
                                  }}</span>
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
                          v-text="
                            selectedEvent.start + ' ~ ' + selectedEvent.end
                          "
                          class="text-center"
                        ></p>
                        <span v-html="selectedEvent.content"></span>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="secondary"
                          @click="selectedOpen = false"
                        >
                          Cancel
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <study-cal-modal
        :add-modal="addModal"
        :is-update="isUpdate"
        :prop-event="propEvent"
        v-on:close="addModal = false"
        v-on:reload="reload"
      />
    </div>
    <request-signin v-else />
  </div>
</template>

<script>
import { format } from "date-fns";

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
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ],
    propEvent: {},
    isUpdate: false,
    addModal: false,
    detail: false,
    detailMenus: [
      { title: "가져오기", value: "movemycal" },
      { title: "일정수정", value: "update" },
      { title: "삭제", value: "delete" }
    ],
    delOpen: false
  }),
  components: {
    studyCalModal: () => import("./StudyCalModal"),
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
    //   임시 더미 입력
    this.events.push({
      name: "테스트",
      content: "테스트내용",
      start: "2020-02-09 10:00",
      end: "2020-02-13 18:00",
      group: "테스트그룹",
      color: "pink",
      event_id: 0,
      group_id: 0
    });

    // 마운트시 내 일정 엑시오스 요청

    this.$refs.calendar.checkChange();
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
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(
          () => ((this.selectedOpen = true), (this.detail = false)),
          10
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      //   const events = [];

      //   const my_events = []; // 내일정 엑시오스 요청

      //   for (var i = 0; i < my_events.length; i++) {
      //     events.push({
      //       name:
      //         my_events.group == "empty"
      //           ? my_events.name
      //           : "[" + my_events.group + "]" + my_events.name,
      //       content: my_events.content,
      //       start:
      //         event.startTime != ""
      //           ? event.startDay + " " + event.startTime
      //           : event.startDay,
      //       end:
      //         event.endTime != ""
      //           ? event.endDay + " " + event.endTime
      //           : event.endDay,
      //       group: event.group,
      //       color: event.color,
      //       event_id: event.event_id
      //     });
      //   }

      this.start = start;
      this.end = end;

      //   console.log(my_events);
      //   console.log(events);
      //   this.events = events;
    },

    loadAddModal(event) {
      if (!event) {
        this.isUpdate = false;
        this.addModal = true;
      } else {
        this.isUpdate = true;
        this.propEvent = event;
        this.addModal = true;
      }
    },

    reload(event) {
      // 추가할 데이터 // 테스트용
      var newEvent = {
        name:
          event.group == "empty"
            ? event.name
            : "[" + event.group + "]" + event.name,
        content: event.content,
        start: event.start,
        end: event.end,
        group: event.group,
        color: event.color,
        event_id: 0,
        group_id: 0
      };
      //테스트라인
      this.events.push(newEvent);

      // 일정목록 리로드
      this.$refs.calendar.checkChange();
    },

    clickDetailMenu(value, event) {
      console.log("clickDetailMenu Method in MyCalendar.vue");

      switch (value) {
        case "movemycal":
          this.moveMyCal(event);
          break;
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
      console.log("eventDelete in MyCalendar.vue", event);

      //삭제 엑시오스 요청

      this.delOpen = false
      this.$refs.calendar.checkChange();
    },

    moveMyCal(event) {
      console.log(event);

      // 엑시오스 요청

      this.$refs.calendar.checkChange();
    }
  }
};
</script>
