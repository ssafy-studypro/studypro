<template>
  <v-dialog id="modal" v-model="open" max-width="400px">
    <slot name="toolbar"></slot>
    <v-card flat max-width="500px">
      <v-col class="px-5 pt-5 pb-0">
        <slot name="text"> </slot>
      </v-col>
      <slot name="btn">
        <div class="text-end pr-3 pb-3">
          <v-btn text @click="open = false">확인</v-btn>
        </div>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "modal",
  data: () => ({
    open: false
  }),
  props: ["openModal"],
  watch: {
    openModal() {
      this.open = this.openModal;
    },
    open() {
      if (!this.open) {
        this.$emit("close");
      }
    }
  }
};
</script>
