<template>
  <div id="imageInput">
    <!-- slot for parent component to activate the file changer -->
    <v-row justify="center">
      <slot name="activator"></slot>
    </v-row>
    <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->
    <v-row justify="center">
    <v-file-input
      accept="image/png, image/jpeg, image/bmp"
      placeholder="Pick an image"
      prepend-icon="mdi-camera"
      ref="file"
      @change="onFileChange($event)"
      @click:clear="clearImg"
      type="file"
    ></v-file-input>
    </v-row>
    <!-- error dialog displays any potential error messages -->
    <v-dialog v-model="errorDialog" max-width="300">
      <v-card>
        <v-card-text class="subheading">{{ errorText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="errorDialog = false" text>Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "imageInput",
  data: () => ({
    errorDialog: null,
    errorText: "",
    uploadFieldName: "file",
    maxSize: 1024,
    imageName: ""
  }),
  props: {
    // Use "value" to enable using v-model
    value: Object,
    clear: Function
  },
  methods: {
    onFileChange(imageFile) {
      const { maxSize } = this;
      if (imageFile) {
        let size = imageFile.size / maxSize / maxSize;
        if (!imageFile.type.match("image.*")) {
          // check whether the upload is an image
          this.errorDialog = true;
          this.errorText = "Please choose an image file";
        } else if (size > 10) {
          // check whether the size is greater than the size limit
          this.errorDialog = true;
          this.errorText =
            "Your file is too big! Please select an image under 10MB";
        } else {
          // Append file into FormData and turn file into image URL
          let imageURL = URL.createObjectURL(imageFile);
          // Emit the FormData and image URL to the parent component
          this.imageName = imageFile;
          this.$emit("input", { imageFile, imageURL });
        }
      }
    },
    clearImg(){
      this.$emit('clear')
    }
  }
};
</script>
