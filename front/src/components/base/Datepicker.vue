<template>
  <div id="datepicker">
    <v-menu v-model="menu" :close-on-click="false" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" color="primary">
          <span v-if="pick === ''">Click</span>
          <span v-else>{{ pick }}</span>
        </v-btn>
      </template>
      <v-card>
        <div>
          <v-card-text class="pa-0">
            <v-date-picker
              v-model="startdateinput"
              locale="en-us"
              first-day-of-week="1"
              no-title
              :min="minDate"
            ></v-date-picker>
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <v-btn text>Cancel</v-btn>
            <v-btn text color="primary">Apply</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { DEFAULT_DATE } from "@/utils/constants";

export default {
  name: "datepicker",
  props: {
    startdateinput: {
      type: String,
      default: DEFAULT_DATE
    }
  },
  data: () => ({
    menu: false,
    value: ""
  }),
  methods: {
    emitRange() {
      this.$emit("input", this.pick);
    }
  },
  computed: {
    pick() {
      if (this.value) {
        return "";
      }
      const result = this.value;
      return `${result}`;
    },
    minDate() {
      return DEFAULT_DATE;
    }
  },
  watch: {
    menu(isOpen) {
      console.log(this.menu)
      if (!isOpen) {
        this.closeMenu();
      } else {
        this.highlight();
      }
    }
  }
};
</script>
