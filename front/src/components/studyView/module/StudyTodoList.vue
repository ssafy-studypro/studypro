<template>
  <v-content class="pa-0">
    <v-card flat>
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="8">
            <v-icon class="black--text pl-1" x-large>alarm</v-icon>
            <span class="Hline ml-2">오늘의 일정</span>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card flat v-show="!items">
        <v-row no-gutters style="height:100%" align="center" justify="center">
          <v-col cols="12">
            <v-card flat align="center" style="width: 100%; height: 100%" class="mb-7">
              <span class="calAlarm">오늘의 일정이 없습니다.</span>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <v-list two-line v-show="items">
        <v-row no-gutters>
          <v-col cols="6">
            <v-card outlined min-height="300" class="mx-2">
              <v-card-title>오늘의 할 일</v-card-title>
              <v-divider class="mx-2" />
              <v-list-item-group v-model="selected" multiple active-class="pink--text">
                <template v-for="(item, index) in items">
                  <v-list-item v-show="!isSelected(index)" :key="item.title">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.content"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-list-item-action-text v-text="item.start_date"></v-list-item-action-text>
                        <v-icon color="grey lighten-1">favorite_border</v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                  <v-divider class="mx-2" v-if="index + 1 < items.length" :key="index"></v-divider>
                </template>
              </v-list-item-group>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card outlined min-height="300" class="mx-2">
              <v-card-title>완료한 일</v-card-title>
              <v-divider class="mx-2" />
              <v-list-item-group v-model="selected" multiple active-class="pink--text">
                <template v-for="(item, index) in items">
                  <v-list-item v-show="isSelected(index)" :key="item.title">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.content"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-list-item-action-text v-text="item.start_date"></v-list-item-action-text>
                        <v-icon color="yellow">favorite</v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                  <v-divider class="mx-2" v-if="index + 1 < items.length" :key="index"></v-divider>
                </template>
              </v-list-item-group>
            </v-card>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-content>
</template>

<script>
import WorkService from "@/services/work.service";
import { format } from 'date-fns'

export default {
  props: ["study_id"],
  data: () => ({
    selected: [],
    items: []
  }),

  created() {
    this.getTodo();
  },

  methods: {
    async isSelected(index) {
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i] === index) {
          // item.status = '완료'
          // await this.update(item)
          return true;
        }
      }
      return false;
    },
    async isSelected2(index, item) {
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i] === index) {
          item.status = '활성'
          await this.update(item)
          return true;
        }
      }
      return false;
    },
    async getTodo() {
      const today = format(new Date(), 'yyyy-MM-dd')
      let res = await WorkService.getWorks({
        type: "study",
        study_id: this.study_id,
      });
      this.items = [];
      for(let item of res){
        if(item.dates == '')  continue;
        let arr = item.dates.split('/')
        for(let date of arr){
          if(date == today){
            this.items.push(item);
            break;
          }
        }
      }
    },

    async update(event) {
      let updateEvent = JSON.parse(JSON.stringify(event));
      updateEvent.work_id = updateEvent.id;
      //수정 엑시오스 요청
      await WorkService.updateWork(updateEvent);
    },
  }
};
</script>

<style scoped>
.Hline {
  font-size: 25px !important;
  font-weight: bold !important;
}
.calAlarm {
  font-size: 18px !important;
  color: #808080 !important;
}
</style>