<template>
  <div id="createGroup" class="mx-10">
    <v-card flat>
      <v-card-title>
        그룹 생성
      </v-card-title>
      <v-row class="ml-1 mb-2 mt-10">
        <span class="red--text">*</span>는 필수항목입니다.
      </v-row>
      <hr />
      <v-row align="center">
        <v-col cols="3"><span class="red--text">*</span>카테고리</v-col>
        <v-col cols="9" md="2" class="py-0"
          ><span class="red--text">*</span>대분류</v-col
        >
        <v-col cols="3" class="d-md-none" />
        <v-col cols="9" md="7" class="py-0">
          <div>
            <v-overflow-btn
              :items="majorItems"
              v-model="major"
              segmented
              dense
              style="width: 200px"
            ></v-overflow-btn>
          </div>
        </v-col>
        <v-col cols="3" />
        <v-col cols="9" md="2" class="py-0"
          ><span class="red--text">*</span>소분류</v-col
        >
        <v-col cols="3" class="d-md-none" />
        <v-col cols="9" md="7" class="py-0">
          <div>
            <v-overflow-btn
              class="mt-4"
              :items="minorItems"
              v-model="minor"
              segmented
              dense
              style="width: 200px"
            ></v-overflow-btn>
          </div>
        </v-col>
      </v-row>
      <hr />
      <v-row align="center">
        <v-col cols="12" sm="3" class="pb-0"
          ><span class="red--text">*</span>그룹명</v-col
        >
        <v-col cols="10" sm="7">
          <v-text-field
            v-model="groupName"
            label="그룹명"
            :rules="groupRules"
            required
            dense
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12" sm="3" class="pb-0"
          ><span class="red--text">*</span>모임목표(간이)</v-col
        >
        <v-col cols="10" sm="7">
          <v-text-field
            v-model="groupTarget"
            label="모임목표"
            :rules="targetRules"
            required
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <hr class="d-none" />
      <v-row>
        <v-col cols="12" class="pb-0"
          ><span class="red--text">*</span>모임소개(상세)</v-col
        >
        <v-col cols="12" class="py-0">
          <v-textarea
            class="pt-6"
            label="그룹에 대한 소개를 150자 이하로 입력해주세요"
            outlined
            v-model="regText"
            :rules="textRules"
            hide-details
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3" class="pb-0 pt-5">인원제한</v-col>
        <v-col cols="9" class="py-0">
          <v-overflow-btn
            :items="dropItems"
            v-model="userLimit"
            segmented
            dense
            label="제한없음"
            style="width: 200px"
            hide-details
          ></v-overflow-btn>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">기간</v-col>
        <v-col cols="9">
          <v-daterange
            v-model="range"
            display-format="yyyy-MM-dd"
            no-title
            :action-labels="{ apply: 'Apply' }"
          ></v-daterange>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3"><span class="red--text">*</span>요일</v-col>
        <v-col cols="9">
          <v-btn-toggle v-model="dayofweek" multiple dense group>
            <v-row>
              <v-btn class="multiplebtn" elevation="0" value="Mon">Mon</v-btn>
              <v-btn class="multiplebtn" elevation="0" value="Tue">Tue</v-btn>
              <v-btn class="multiplebtn" elevation="0" value="Wed">Wed</v-btn>
              <v-btn class="multiplebtn" elevation="0" value="Thu">Thu</v-btn>
              <v-btn class="multiplebtn" elevation="0" value="Fri">Fri</v-btn>
              <v-btn class="multiplebtn" elevation="0" value="Sat">Sat</v-btn>
              <v-btn class="multiplebtn" elevation="0" value="Sun">Sun</v-btn>
            </v-row>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="3"><span class="red--text">*</span>시간대</v-col>
        <v-col cols="12" sm="9" class="py-0">
          <v-row>
            <v-col cols="5" md="4" class="py-0 pr-0">
              <v-menu
                ref="startTime"
                v-model="active.startTime"
                :close-on-content-click="false"
                :nudge-right="30"
                :return-value.sync="starttime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="starttime"
                    label="시작시간"
                    prepend-icon="access_time"
                    readonly
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model="starttime"
                  full-width
                  header-color="customTheme"
                  ampm-in-title
                  @click:minute="$refs.startTime.save(starttime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" md="1" class="pb-0 px-0 text-center">
              <span>~</span>
            </v-col>
            <v-col cols="5" md="4" class="py-0 pl-0">
              <v-menu
                ref="endTime"
                v-model="active.endTime"
                :close-on-content-click="false"
                :nudge-right="30"
                :return-value.sync="endtime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endtime"
                    label="종료시간"
                    prepend-icon="access_time"
                    readonly
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model="endtime"
                  full-width
                  header-color="customTheme"
                  ampm-in-title
                  @click:minute="$refs.endTime.save(endtime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-spacer />
          </v-row>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3" class="pt-6">현재상태</v-col>
        <v-col cols="9">
          <v-overflow-btn
            class="mt-4"
            :items="statusItems"
            v-model="status"
            segmented
            dense
            label="준비중"
            style="width: 200px"
            hide-details
          ></v-overflow-btn>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">공개여부</v-col>
        <v-col cols="9" class="py-0">
          <v-radio-group v-model="radios" :mandatory="false">
            <v-radio label="공개" value="공개"></v-radio>
            <v-radio label="비공개" value="비공개"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12" md="3">스터디 이미지</v-col>
        <v-col cols="12" sm="11" md="9" offset-sm="1" offset-md="0">
          <image-input
            v-model="image"
            class="wrap-content pt-4 pb-3"
            v-on:clear="imgClear"
          >
            <div slot="activator" class="wrap-content">
              <img
                src="@/assets/images/no_image.png"
                style="width:400px; height:200px"
                v-if="!image"
              />
              <img
                :src="image.imageURL"
                v-else
                alt="Study Image"
                style="width:400px;height:200px;"
              />
            </div>
          </image-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-end">
          <span class="red--text pr-5"> {{ message }} </span>
          <v-btn
            class="primary font-weight-light mr-4 mb-3"
            @click="createGroup"
            :disabled="!isComplete"
            width="150px"
            >모임생성</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
// import WorkService from "@/services/work.service";
import VDaterange from "@/components/base/VDaterange";
import { format } from "date-fns";

export default {
  name: "createGroup",
  data: () => ({
    groupName: "",
    regText: "",
    groupTarget: "",
    groupRules: [
      v => !!v || "그룹명을 입력해주세요",
      v =>
        (v && v.length <= 15 && v.length >= 3) ||
        "그룹명은 3자이상 15자이내 입니다"
    ],
    textRules: [v => !!v || (v && v.length <= 150) || "150자 초과"],
    targetRules: [
      v => !!v || "목표를 작성해주세요",
      v => (v && v.length <= 15) || "15자 이내로 작성해주세요"
    ],
    dropItems: [],
    userLimit: 0,
    majorItems: [],
    major: -1,
    minorItems: [],
    minor: -1,
    range: {},
    dayofweek: [],
    starttime: "",
    endtime: "",
    radios: "공개",
    isComplete: false,
    message: "",
    image: null,
    status: "진행준비",
    statusItems: [
      {
        text: "진행준비",
        value: "진행준비",
        callback: () => {}
      },
      {
        text: "진행중",
        value: "진행중",
        callback: () => {}
      },
      {
        text: "종료",
        value: "종료",
        callback: () => {}
      }
    ],
    active: {
      startTime: false,
      endTime: false
    }
  }),
  props: ["success"],
  components: {
    VDaterange,
    imageInput: () => import("@/components/base/ImageInput")
  },
  computed: {
    userID: function() {
      return this.$store.getters.userID;
    },
    accessToken: function() {
      return this.$store.getters.getToken;
    }
  },
  watch: {
    groupName() {
      this.validation();
    },
    groupTarget() {
      this.validation();
    },
    regText() {
      this.validation();
    },
    minor() {
      this.validation();
    },
    userLimit() {
      this.validation();
    },
    starttime() {
      this.validation();
    },
    endtime() {
      this.validation();
    },
    dayofweek() {
      this.validation();
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
      this.validation();
    }
  },
  methods: {
    validation() {
      if (this.major == -1) {
        this.message = "대분류를 선택해주세요.";
        this.isComplete = false;
        return;
      } else if (this.minor == -1) {
        this.message = "소분류를 선택해주세요.";
        this.isComplete = false;
        return;
      } else if (this.groupName.length < 3) {
        this.message = "그룹명은 3자이상입니다.";
        this.isComplete = false;
        return;
      } else if (this.groupTarget == "") {
        this.message = "그룹의 목표를 입력해주세요.";
        this.isComplete = false;
        return;
      } else if (this.regText == "") {
        this.message = "그룹소개를 입력해주세요.";
        this.isComplete = false;
        return;
      } else if (this.dayofweek.length == 0) {
        this.message = "요일을 선택해주세요.";
        this.isComplete = false;
        return;
      } else if (this.starttime == "") {
        this.message = "시작시간을 입력해주세요.";
        this.isComplete = false;
        return;
      } else if (this.endtime == "") {
        this.message = "종료시간을 입력해주세요.";
        this.isComplete = false;
        return;
      }

      //시간체크
      var start_hour = this.starttime.split(":")[0];
      var start_minute = this.starttime.split(":")[1];
      var end_hour = this.endtime.split(":")[0];
      var end_minute = this.endtime.split(":")[1];
      if (
        start_hour > end_hour ||
        (start_hour == end_hour && start_minute > end_minute)
      ) {
        this.message = "시작시간이 종료시간보다 늦습니다";
        this.isComplete = false;
        return;
      }

      this.message = "";
      this.isComplete = true;
    },
    async createGroup() {
      var formData = new FormData();
      formData.append("name", this.groupName);
      formData.append("goal", this.groupTarget);
      formData.append("description", this.regText);
      formData.append("minor_class_id", this.minor);
      formData.append("user_limit", this.userLimit);
      formData.append(
        "start_time",
        this.starttime
          ? this.starttime.split(":")[0] + this.starttime.split(":")[1]
          : "0000"
      );
      formData.append(
        "end_time",
        this.endtime
          ? this.endtime.split(":")[0] + this.endtime.split(":")[1]
          : "0000"
      );
      formData.append("status", this.status);
      if (this.image) {
        formData.append("img", this.image.imageFile);
      }
      formData.append(
        "start_day",
        this.range.start ? this.range.start : format(new Date(), "yyyy-MM-dd")
      );
      formData.append(
        "end_day",
        this.range.end ? this.range.end : format(new Date(), "yyyy-MM-dd")
      );
      formData.append("progress_days", this.dayofweek);
      formData.append("isOpen", this.radios == "공개" ? true : false);

      const res = await this.$store.dispatch("study/createStudy", formData);
      if (res.state == "success") {
        this.$emit("success", res.gid);
        this.makeCard();
        this.message = "";
      } else {
        this.message = "이미 존재하는 모임명입니다";
      }
    },

    imgClear() {
      this.image = null;
    }
  },
  async mounted() {
    this.dropItems = [{ value: 0, text: "제한없음", callback: () => {} }];
    for (var i = 1; i <= 99; i++) {
      this.dropItems.push({
        value: i,
        text: i,
        callback: () => {}
      });
    }

    this.majorItems = [];
    const getMajorRes = await this.$store.dispatch("study/getMajorClass"); //await api.getMajorClasses();
    for (let i = 0; i < getMajorRes.length; i++) {
      this.majorItems.push({
        value: getMajorRes[i].id,
        text: getMajorRes[i].name,
        callback: () => {}
      });
    }
  },

  async makdCard() {
    // // 추가할 데이터
    // var newEvent = {
    //   study_id: this.study_id,
    //   type: "study",
    //   name: this.input.name,
    //   content: this.input.content,
    //   dates: this.input.dates,
    //   start_time: this.input.startTime,
    //   end_time: this.input.endTime,
    //   status: this.input.isDefault ? "기본" : "할 일",
    //   color: ""
    // };
    // //데이터추가 엑시오스
    // let res = await WorkService.createWork(newEvent);
    // if (res.id) {
    //   this.$emit("reload");
    //   this.close();
    // } else {
    //   this.message = "생성하지 못했습니다.";
    // }
    // this.isLoading = false;
  }
};
</script>

<style>
.v-text-field__details {
  display: inline-block !important;
}

.v-radio {
  display: flex;
  float: left;
}

.v-input--radio-group__input {
  display: inline-block;
}

.v-messages {
  display: none;
}

.no-hover-color:hover {
  background-color: white !important;
}

.multiplebtn {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
