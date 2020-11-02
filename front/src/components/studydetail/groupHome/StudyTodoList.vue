<template>
  <v-card width="500" class="mx-auto">
    <v-toolbar color="blue" dark>
      <v-toolbar-title>오늘의 할일</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>

    <v-list two-line>
      <v-list-item-group v-model="selected" multiple active-class="pink--text">
        <template v-for="(item, index) in items">
          <v-list-item :key="item.title">
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text
                  v-text="item.action"
                ></v-list-item-action-text>
                <v-icon v-if="!active" color="grey lighten-1">
                  star_border
                </v-icon>

                <v-icon v-else color="yellow">
                  star
                </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    selected: [2],
    items: [
      {
        action: "15 min",
        title: "영어 단어 외우기"
      },
      {
        action: "2 hr",
        title: "자기소개서 쓰기"
      },
      {
        action: "6 hr",
        title: "집에 가기"
      }
    ]
  })
};
</script>
