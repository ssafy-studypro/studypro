<template>
  <v-card
    id="canvas_card"
    oncontextmenu="return false"
    onselectstart="return false"
    ondragstart="return false"
  >
    <canvas
      id="canvas"
      ref="canvas"
      @mousedown.left="mouse_down"
      @mouseup.left="mouse_up"
      @mousemove="mouse_move"
      @mouseout="mouse_out"
      @mousedown.right="eraiser_down"
      @mouseup.right="eraiser_up"
      height="653"
      width="1143"
    ></canvas>

    <swatches
      id="swatches"
      class="btns"
      v-model="color"
      shapes="circles"
      colors="text-basic"
      row-length="6"
      popover-to="right"
      :exceptions="exceptions"
      exception-mode="hidden"
    />

    <v-menu id="slider" :close-on-content-click="false" :nudge-width="200" offset-y>
      <template v-slot:activator="{on}">
        <v-btn id="pencil" class="btns" fab dark small :color="color" v-on="on">
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-slider  label="굵기" min="1" max="20" height="12" tick-size="6" class="pt-5 px-3"  v-model="width"></v-slider>
      </v-card>
    </v-menu>

    <v-btn id="clear" absolute class="btns" fab dark small color="primary" @click="clear">
      <v-icon dark>mdi-delete</v-icon>
    </v-btn>
    
  </v-card>
</template>

<script>
import Swatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.min.css";

export default {
  components: {
    Swatches
  },

  props: ["socket", "study_id"],

  data() {
    return {
      width: 5,
      color: "#000000",
      isDown: false, // 마우스 버튼을 눌렀나 안 눌렀나
      isClear: false,
      old_x: "",
      old_y: "",
      new_x: "",
      new_y: "",
      exceptions: ["#FFFFFF"]
      // canvas : document.getElementById("canvas"),
      // context:'',        //Canvas 객체 추출
    };
  },

  methods: {
    mouse_down(event) {
      this.isDown = true;
      this.old_x = event.offsetX;
      this.old_y = event.offsetY;

      this.socket.emit("draw", {
        study_id: this.study_id,
        width: this.width,
        color: this.color,
        x1: this.old_x,
        y1: this.old_y,
        x2: this.old_x + 1,
        y2: this.old_y + 1
      });
    },
    mouse_up() {
      this.isDown = false;
    },
    eraiser_down(event) {
      event.pr;
      this.isClear = true;
      this.old_x = event.offsetX;
      this.old_y = event.offsetY;
    },
    eraiser_up() {
      this.isClear = false;
    },
    mouse_move(event) {
      if (!(this.isDown || this.isClear)) {
        return;
      }

      let color = "";
      let width = "";
      if (this.isDown) {
        color = this.color;
        width = this.width;
      } else if (this.isClear) {
        color = "white";
        width = 40;
      }

      this.new_x = event.offsetX;
      this.new_y = event.offsetY;

      this.socket.emit("draw", {
        study_id: this.study_id,
        width: width,
        color: color,
        x1: this.old_x,
        y1: this.old_y,
        x2: this.new_x,
        y2: this.new_y
      });
      this.old_x = this.new_x;
      this.old_y = this.new_y;
    },
    mouse_out() {
      this.isDown = false;
      this.isClear = false;
    },
    clear() {
      this.socket.emit("clear", {
        study_id: this.study_id
      });
    }
  },
  mounted() {
    this.socket.emit("load_image", {
      study_id: this.study_id
    });

    this.canvas = document.getElementById("canvas");
    // this.canvas.width = document.getElementById("canvas_card").offsetWidth;
    // this.canvas.height = document.getElementById("canvas_card").offsetHeight;

    this.context = this.canvas.getContext("2d");
    this.socket.on("line", data => {
      this.context.lineWidth = data.width;
      this.context.lineCap = "round";
      this.context.strokeStyle = data.color;
      this.context.beginPath();
      this.context.moveTo(data.x1, data.y1);
      this.context.lineTo(data.x2, data.y2);
      this.context.stroke();
    });

    this.socket.on("clear", () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    });

    this.socket.on("load_image", data => {
      let image_data = this.canvas.toDataURL();

      this.socket.emit("send_image", {
        socket_id: data,
        image_data: image_data
      });
    });

    this.socket.on("send_image", data => {
      let image = new Image();
      image.onload = () => {
        this.context.drawImage(image, 0, 0);
      };
      image.src = data.image_data;
    });

    // window.onresize = () => {
    //   console.log(document.getElementById("canvas_card").offsetHeight);
    //   console.log(document.getElementById("canvas_card").offsetWidth);
    // };
  }
};
</script>