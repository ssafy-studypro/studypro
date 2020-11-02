<template>
  <v-dialog id="addmodal" v-model="open" max-width="540px">
    <v-card style="overflow:hidden">
      <v-card-title class="customTheme darken-1 white--text pb-3">
        <span
          v-text="isUpdate ? '일정 수정' : '일정 추가'"
          class="headline"
        ></span>
      </v-card-title>
      <!-- 내용입력란 -->
      <v-row justify="center">
        <v-col cols="11">
          <!-- 날짜/시간 선택 -->
          <!-- 시작 날짜 -->
          <v-row>
            <v-col cols="12" sm="8" class="pb-0">
              <v-menu
                ref="startDay"
                v-model="active.startDay"
                :close-on-content-click="false"
                :nudge-right="30"
                :return-value.sync="input.startDay"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="input.startDay"
                    class="mt-3"
                    label="시작날짜"
                    prepend-icon="event"
                    dense
                    readonly
                    outlined
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="input.startDay" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="dark lighten-2"
                    @click="active.startDay = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="dark lighten-2"
                    @click="$refs.startDay.save(input.startDay)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- 시작 날짜 끝 -->
            <!-- 시작 시간 -->
            <v-col cols="6" sm="4" class="pb-0">
              <v-menu
                ref="startTime"
                v-model="active.startTime"
                :close-on-content-click="false"
                :nudge-right="30"
                :return-value.sync="input.startTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="input.startTime"
                    label="시작시간"
                    prepend-icon="access_time"
                    readonly
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model="input.startTime"
                  full-width
                  header-color="customTheme"
                  @click:minute="$refs.startTime.save(input.startTime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
          <!-- <hr style="border: 0.5px solid #404040"/> -->
          <!-- 시작 시간 끝 -->

          <!-- 종료 날짜 -->
          <v-row>
            <v-col cols="12" sm="8" class="pt-1 pb-0">
              <v-menu
                ref="endDay"
                v-model="active.endDay"
                :close-on-content-click="false"
                :nudge-right="30"
                :return-value.sync="input.endDay"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="input.endDay"
                    class="mt-3"
                    label="종료날짜"
                    prepend-icon="event"
                    dense
                    readonly
                    outlined
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="input.endDay" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="dark lighten-2"
                    @click="active.endDay = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="dark lighten-2"
                    @click="$refs.endDay.save(input.endDay)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- 종료 날짜 끝 -->
            <!-- 종료 시간 -->
            <v-col cols="6" sm="4" class="py-0">
              <v-menu
                ref="endTime"
                v-model="active.endTime"
                :close-on-content-click="false"
                :nudge-right="30"
                :return-value.sync="input.endTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="input.endTime"
                    label="종료시간"
                    prepend-icon="access_time"
                    readonly
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model="input.endTime"
                  full-width
                  header-color="customTheme"
                  @click:minute="$refs.endTime.save(input.endTime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
          <!-- <hr style="border: 0.5px solid #404040"/> -->
          <!-- 종료 시간 끝 -->
          <!-- 날짜/시간 선택 끝 -->

          <!-- 이름/내용 입력 -->
          <!-- 이름입력 -->
          <v-row justify="center">
            <v-col cols="12" class="py-0">
              <v-text-field v-model="input.name" label="일정명"> </v-text-field>
            </v-col>
          </v-row>
          <!-- 이름입력 끝 -->
          <!-- 내용입력 -->
          <v-row justify="center">
            <v-col cols="12" class="pt-0">
              <v-textarea
                label="내용"
                outlined
                height="150px"
                v-model="input.content"
                single-line
                hide-details
              ></v-textarea>
            </v-col>
          </v-row>
          <!-- 내용입력 끝 -->
          <!-- 이름/내용 입력 끝 -->

          <!-- 그룹 선택 -->
          <v-row justify="center">
            <v-col cols="12" sm="6" class="pt-1 pb-0">
              <v-select
                v-model="input.group"
                :items="groupOptions"
                label="그룹선택"
                outlined
                dense
                hide-details
              ></v-select>
            </v-col>
            <!-- 그룹 선택 끝 -->

            <!-- 색상선택 -->
            <v-col cols="12" sm="6" class="pt-1 pb-0">
              <v-select
                v-model="input.color"
                :items="colorOptions"
                label="색상"
                hide-details
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
          <!-- 색상선택 끝 -->
        </v-col>
      </v-row>
      <!-- 내용입력란 끝 -->

      <!-- 버튼 -->
      <v-row justify="end" class="mb-2">
        <v-col cols="12" class="text-end pb-0">
          <span class="error--text">{{ message }}</span>
          <v-btn text color="dark lighten-2" @click="close">
            Cancel
          </v-btn>
          <v-btn text color="dark lighten-2" @click="create" v-if="!isUpdate">
            OK
          </v-btn>
          <v-btn text color="dark lighten-2" @click="update" v-else>
            Update
          </v-btn>
        </v-col>
      </v-row>
      <!-- 버튼 끝 -->
    </v-card>
  </v-dialog>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "addmodal",
  data: () => ({
    open: false,
    isLoading: false,

    active: {
      startDay: false,
      startTime: false,
      endDay: false,
      endTime: false
    },

    input: {
      startDay: format(new Date(), "yyyy-MM-dd"),
      startTime: "",
      endDay: format(new Date(), "yyyy-MM-dd"),
      endTime: "",
      name: "",
      content: "",
      group: "empty",
      color: "primary"
    },
    event_id: '',

    message: "",

    groupOptions: [{ text: "선택안함", value: "empty" }],

    colorOptions: [
      { text: "Primary", value: "primary" },
      { text: "Secondary", value: "secondary" },
      { text: "Accent", value: "accent" },
      { text: "Red", value: "red" },
      { text: "Pink", value: "pink" },
      { text: "Purple", value: "purple" },
      { text: "Deep Purple", value: "deep-purple" },
      { text: "Indigo", value: "indigo" },
      { text: "Blue", value: "blue" },
      { text: "Light Blue", value: "light-blue" },
      { text: "Cyan", value: "cyan" },
      { text: "Teal", value: "teal" },
      { text: "Green", value: "green" },
      { text: "Light Green", value: "light-green" },
      { text: "Lime", value: "lime" },
      { text: "Yellow", value: "yellow" },
      { text: "Amber", value: "amber" },
      { text: "Orange", value: "orange" },
      { text: "Deep Orange", value: "deep-orange" },
      { text: "Brown", value: "brown" },
      { text: "Blue Gray", value: "blue-gray" },
      { text: "Gray", value: "gray" },
      { text: "Black", value: "black" }
    ]
  }),
  props: ["addModal", "isUpdate", "propEvent"],
  watch: {
    addModal() {
      this.open = this.addModal;
      if (this.isUpdate) {
        var start_arr = this.propEvent.start.split(" ");
        var end_arr = this.propEvent.end.split(" ");
        var name_arr = this.propEvent.name.split("]");
        this.input = {
          startDay: start_arr[0],
          startTime: start_arr.length == 2 ? start_arr[1] : "",
          endDay: end_arr[0],
          endTime: end_arr.length == 2 ? end_arr[1] : "",
          name: name_arr.length == 2 ? name_arr[1] : name_arr[0],
          content: this.propEvent.content,
          group: this.propEvent.group,
          color: this.propEvent.color
        };
        this.event_id = this.propEvent.event_id
      }
    },
    open() {
      if (!this.open) {
        this.close();
      }
    }

    //Test
  },
  methods: {
    close() {
      this.input = {
        startDay: format(new Date(), "yyyy-MM-dd"),
        startTime: "",
        endDay: format(new Date(), "yyyy-MM-dd"),
        endTime: "",
        name: "",
        content: "",
        group: "empty",
        color: "primary"
      };
      this.$emit("close");
    },

    create() {
      this.message = "";
      if (this.input.name == "") {
        this.message = "일정명을 입력해주세요";
        return;
      }

      let s_arr = this.input.startDay.split("-");
      let e_arr = this.input.endDay.split("-");
      let start = { year: s_arr[0], month: s_arr[1], day: s_arr[2] };
      let end = { year: e_arr[0], month: e_arr[1], day: e_arr[2] };
      if (
        start.year > end.year ||
        start.month > end.month ||
        start.day > end.day
      ) {
        this.message = "종료날짜를 확인해주세요";
        return;
      }

      if (this.input.startDay == this.input.endDay) {
        if (this.input.startTime == "") {
          this.input.startTime = "00:00";
        }
        if (this.input.endTime == "") {
          this.input.endTime = "23:59";
        }
        s_arr = this.input.startTime.split(":");
        e_arr = this.input.endTime.split(":");
        let startT = { hour: s_arr[0], minute: s_arr[1] };
        let endT = { hour: e_arr[0], minute: e_arr[1] };
        if (startT.hour > endT.hour || startT.minute > endT.minute) {
          this.message = "종료시간을 확인해주세요";
          return;
        }
      }

      // 추가할 데이터
      var newEvent = {
        name: this.input.name,
        content: this.input.content,
        start:
          this.input.startTime != ""
            ? this.input.startDay + " " + this.input.startTime
            : this.input.startDay,
        end:
          this.input.endTime != ""
            ? this.input.endDay + " " + this.input.endTime
            : this.input.endDay,
        group: this.input.group,
        color: this.input.color,
        event_id: this.event_id
      };

      //데이터추가 엑시오스

      //테스트 변수 제거해야함
      this.$emit("reload", newEvent);
      this.close();
    },

    update() {
      // 수정 데이터
      var updateEvent = {
        name: this.input.name,
        content: this.input.content,
        start:
          this.input.startTime != ""
            ? this.input.startDay + " " + this.input.startTime
            : this.input.startDay,
        end:
          this.input.endTime != ""
            ? this.input.endDay + " " + this.input.endTime
            : this.input.endDay,
        group: this.input.group,
        color: this.input.color
      };

      //수정 엑시오스 요청
      this.$emit('reload', updateEvent)
      this.close()
    }
  },

  mounted() {
    if (this.$store.getters["auth/isAuth"]) {
      this.$emit("close");
      return;
    }
  }
};
</script>

<style scoped>
.controls {
  position: relative;
}
</style>
