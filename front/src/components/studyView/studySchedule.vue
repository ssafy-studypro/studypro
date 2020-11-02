<template>
  <div id="mycal">
    <div v-if="isAuth">
      <v-row class="ml-4" align="center" justify="center">
        <v-col cols="11" sm="12" offset="1" offset-sm="0">
          <v-expansion-panels style="z-Index:0;">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="ex-title">Calendar</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card class="py-0" flat>
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
                            >오늘날짜로</v-btn
                          >
                          <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="prev"
                          >
                            <v-icon small>mdi-chevron-left</v-icon>
                          </v-btn>
                          <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="next"
                          >
                            <v-icon small>mdi-chevron-right</v-icon>
                          </v-btn>
                          <v-toolbar-title>{{ title }}</v-toolbar-title>
                          <v-spacer></v-spacer>
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
                                    <li
                                      v-for="item in detailMenus"
                                      :key="item.title"
                                    >
                                      <v-btn
                                        text
                                        @click="
                                          clickDetailMenu(
                                            item.value,
                                            selectedEvent
                                          )
                                        "
                                      >
                                        <span style="color:black">
                                          {{ item.title }}
                                        </span>
                                      </v-btn>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </v-toolbar>
                            <v-card-text>
                              <p
                                v-text="
                                  selectedEvent.start +
                                    ' ~ ' +
                                    selectedEvent.end
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
                                >Cancel</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </v-menu>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- 이슈 -->
          <v-row class="mt-8">
            <v-col cols="4" v-for="(issue, index) in issues" :key="index">
              <p class="issue-container-title text-center">
                {{ issue.title }}
              </p>
              <!-- 이슈 박스 -->
              <div class="issue-container py-2 px-2">
                <!-- 할일 기능 -->
                <div v-if="issue.title == '준비'">
                  <!-- 등록 버튼 -->
                  <v-btn
                    class="issue-reg-btn primary white--text mb-4"
                    width="100%"
                    @click="(modal = true), (isUpdate = false)"
                    >일정 등록</v-btn
                  >
                  <!-- 등록버튼 끝 -->
                  <!-- 기본 카드 -->
                  <draggable
                    class="list-default-group"
                    :list="default_items"
                    :group="{ name: 'issue', pull: 'clone', put: false }"
                    v-bind="dragOptions"
                  >
                    <transition-group
                      type="transition"
                      :name="!drag ? 'flip-list' : null"
                    >
                      <div
                        class="list-group-item"
                        v-for="(item, index) in default_items"
                        :key="index"
                      >
                        <v-card
                          class="issue-card default-card"
                          color="redC"
                          @click="
                            (isUpdate = true),
                              (propEvent = item),
                              (modal = true)
                          "
                        >
                          <v-container>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.user_nickname }}
                            </p>
                            <p class="issue-card-title" aria-disabled>
                              {{ item.name }}
                            </p>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.dates | filterDate }}
                            </p>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.start_time }} ~ {{ item.end_time }}
                            </p>
                          </v-container>
                        </v-card>
                      </div>
                    </transition-group>
                  </draggable>
                  <!-- 기본 카드 끝 -->
                </div>
                <!-- 할일 기능 끝 -->
                <!-- 등록된 카드 -->
                <div class="issue-list-container">
                  <draggable
                    class="list-group"
                    :list="issue.items"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                    @change="log($event, issue.title)"
                  >
                    <transition-group
                      type="transition"
                      :name="!drag ? 'flip-list' : null"
                    >
                      <div v-for="(item, index) in issue.items" :key="index">
                        <v-card
                          class="issue-card list-group-item"
                          :color="getColor(issue.title)"
                          @click="
                            (isUpdate = true),
                              (propEvent = item),
                              (modal = true)
                          "
                        >
                          <v-container>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.user_nickname }}
                            </p>
                            <p class="issue-card-title" aria-disabled>
                              {{ item.name }}
                            </p>
                            <v-row>
                              <v-col class="pb-0">
                                <v-btn
                                  v-if="issue.title == '활성'"
                                  class="primary issue-enter-btn"
                                  @click.prevent="enterIssue($event, item)"
                                  ><span>참여</span></v-btn
                                >
                              </v-col>
                              <v-col class="pb-0">
                                <v-row justify="end">
                                  <p class="issue-card-text mr-4" aria-disabled>
                                    {{ item.dates | filterDate }}
                                  </p>
                                </v-row>
                                <v-row justify="end">
                                  <p class="issue-card-text mr-4" aria-disabled>
                                    {{ item.start_time }} ~ {{ item.end_time }}
                                  </p>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card>
                      </div>
                    </transition-group>
                  </draggable>
                </div>
                <!-- 등록된 카드 끝 -->
              </div>
              <!-- 이슈 박스 끝 -->
            </v-col>
            <!-- 이슈 끝 -->
          </v-row>
        </v-col>
      </v-row>
      <study-cal-modal
        :add-modal="modal"
        :is-update="isUpdate"
        :prop-event="propEvent"
        :study_id="study_id"
        v-on:close="(modal = false), (isUpdate = false)"
        v-on:reload="reload"
      />
      <modal :open-modal="errorModal" v-on:close="errorModal = false">
        <template v-slot:text>
          <span v-show="errorType == 'noDays'"
            >날짜를 입력하지 않으면 달력에 표시되지 않습니다</span
          >
          <span v-show="errorType == 'timeDup'"
            >해당시간에 나의 일정이 있습니다</span
          >
        </template>
      </modal>
    </div>
    <request-signin v-else />
  </div>
</template>

<script>
import { format } from "date-fns";
import WorkService from "@/services/work.service";

export default {
  props: ["study_id"],
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
    userOpen: false,
    selectedOpen: false,
    events: [],
    propEvent: {},
    isUpdate: false,
    modal: false,
    errorModal: false,
    errorType: "noDays",
    detail: false,
    detailMenus: [
      { title: "내 일정에 추가", value: "movemycal" },
      { title: "일정 수정", value: "update" },
      { title: "삭제", value: "delete" }
    ],
    delOpen: false,
    picked: false,
    default_items: [],
    issues: [
      {
        title: "준비",
        items: []
      },
      {
        title: "활성",
        items: []
      },
      {
        title: "완료",
        items: []
      }
    ],
    drag: false,
    removed: "",
    added: ""
  }),
  components: {
    studyCalModal: () => import("@/components/studyView/studyCalModal"),
    requestSignin: () => import("@/components/base/RequestSignin"),
    draggable: () => import("vuedraggable"),
    modal: () => import("@/components/base/Modal")
  },
  watch: {
    issues() {
      console.log(this.issues);
    }
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
    },
    getBgColor(hover) {
      if (hover) {
        return "grey";
      } else {
        return "white";
      }
    },
    dragOptions() {
      return {
        animation: 200,
        group: "issue",
        disabled: false,
        ghostClass: "ghost"
      };
    },

    currentUser() {
      return this.$store.getters["auth/getUser"];
    }
  },
  mounted() {
    // 마운트시 내 일정 엑시오스 요청
    this.reload();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      let color;
      if (event.status === "그룹할일") {
        color = "light green";
      } else {
        color = "purple";
      }
      return color;
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
    updateRange({ start, end }) {
      // const events = [];
      // console.log(this.issues[1].items)
      // let my_events = this.issues[1].items;

      // for (let i = 0; i < my_events.length; i++) {
      //   for (let j = 0; j < my_events.dates.length; j++) {
      //     events.push({
      //       name: my_events.name,
      //       content: my_events.content,
      //       start: my_events.dates,
      //       end:
      //         event.endTime != ""
      //           ? event.endDay + " " + event.endTime
      //           : event.endDay,
      //       group: event.group,
      //       color: event.color,
      //       event_id: event.event_id
      //     });
      //   }
      // }

      this.start = start;
      this.end = end;

      //   console.log(my_events);
      //   console.log(events);
      //   this.events = events;
    },

    async reload() {
      let payload = {
        type: "study",
        study_id: this.study_id
      };
      let res = await WorkService.getWorks(payload);
      this.default_items = [];
      this.issues[0].items = [];
      this.issues[1].items = [];
      this.issues[2].items = [];
      for (let item of res) {
        item.dates = this.datesToList(item.dates);
        switch (item.status) {
          case "기본":
            this.default_items.push(item);
            break;
          case "준비":
            this.issues[0].items.push(item);
            break;
          case "활성":
            this.issues[1].items.push(item);
            break;
          case "완료":
            this.issues[2].items.push(item);
            break;
          default:
            console.log(
              "reload method in studyScehdule.vue error",
              item.status
            );
        }
      }

      this.updateEvent();
    },

    getColor(title) {
      let colors = {
        준비: "greenC",
        활성: "blueC",
        완료: "greyC"
      };

      return colors[title];
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
    },
    async create(newEvent) {
      //데이터추가 엑시오스
      let res = await WorkService.createWork(newEvent);
      if (res.type == "study") {
        this.reload();
      }
    },

    async update(event) {
      let updateEvent = JSON.parse(JSON.stringify(event));
      updateEvent.work_id = updateEvent.id;
      //수정 엑시오스 요청
      await WorkService.updateWork(updateEvent);

      if (
        event.type == "study" &&
        updateEvent.status == "활성" &&
        updateEvent.dates.length != 0
      ) {
        this.updateEvent();
      }

      this.reload();
    },
    async log(evt, title) {
      console.log(evt, title)
      if (evt.added) {
        this.added = title;
        if (this.removed != "") {
          evt.added.element.status = title;
          await this.update(evt.added.element);
          this.removed = "";
        }
        if (evt.added.element.status == "기본") {
          let newEvent = JSON.parse(JSON.stringify(evt.added.element));
          newEvent.status = title;
          await this.create(newEvent);
        }
        if (title == "활성" && evt.added.element.dates == "") {
          this.errorType = "noDays";
          this.errorModal = true;
        }
      }
      if (evt.removed) {
        this.removed = title;
        if (this.added != "") {
          evt.removed.element.status = this.added;
          await this.update(evt.removed.element);
          this.added = "";
        }
      }
    },
    updateEvent() {
      this.events = [];
      for (let item of this.issues[1].items) {
        if (item.dates.length == 0) continue;

        for (let date of item.dates) {
          let copy = JSON.parse(JSON.stringify(item));
          copy.start = date + " " + copy.start_time;
          copy.end = date + " " + copy.end_time;
          this.events.push(copy);
        }
      }
    },
    async enterIssue(event, item) {
      event.stopPropagation();

      let payload = {
        type: "personal"
      };
      let myIssues = await WorkService.getWorks(payload);

      // 시간겹치는지 체크
      for (let issue of myIssues) {
        if (issue.dates.length == 0) continue;

        issue.dates = this.datesToList(issue.dates);
        for (let date1 of issue.dates) {
          for (let date2 of item.dates) {
            if (date1 == date2) {
              if (
                (this.isLaterLeftTime(item.start_time, issue.start_time) &&
                  this.isLaterLeftTime(issue.end_time, item.start_time)) ||
                (this.isLaterLeftTime(item.end_time, issue.start_time) &&
                  this.isLaterLeftTime(issue.end_time, item.end_time))
              ) {
                this.errorType = "timeDup";
                this.errorModal = true;
                return;
              }
            }
          }
        }
      }

      // 안겹치면 등록
      // 스터디일정 정보 업데이트
      item.members += ", " + this.currentUser.nickname;
      this.update(item);

      // 내일정으로 생성
      let copy = JSON.parse(JSON.stringify(item));
      copy.type = "personal";
      this.create(copy);
    },

    isLaterLeftTime(time1, time2) {
      let arr1 = time1.split(":");
      let arr2 = time2.split(":");
      let left = {
        hour: arr1[0],
        minute: arr1[1]
      };
      let right = {
        hour: arr2[0],
        minute: arr2[1]
      };

      if (left.hour > right.hour) {
        return true;
      } else if (left.hour == right.hour && left.minute >= right.minute) {
        return true;
      }

      return false;
    }
  },
  filters: {
    filterDate(values) {
      if (values.length == 0) return;
      let result = "";
      for (let value of values) {
        let arr = value.split("-");
        result += " " + arr[1] + "/" + arr[2];
      }

      return result;
    }
  }
};
</script>
