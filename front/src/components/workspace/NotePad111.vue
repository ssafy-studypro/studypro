<template>
  <v-card
    id="notepad_card"
    class="notepad_card"
    ref="board"
    oncontextmenu="return false"
    ondragstart="return false"
    onselectstart="return false"
    maxHeight="640"
    maxWidth="640"
  >
    <div id="firepad-container"></div>
  </v-card>
</template>

<script src="https://www.gstatic.com/firebasejs/7.6.2/firebase.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.51.0/codemirror.js"></script>
<script src="https://cdn.firebase.com/libs/firepad/1.2.0/firepad.min.js"></script>


<script>

export default {
  data() {
    return {};
  },
  props: ["socket", "study_id"],
  watch: {},

  methods: {
    init() {
      //// Initialize Firebase.
      //// TODO: replace with your Firebase project configuration.
      
      let config = {
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.VUE_APP_FIREABASE_URL
      };
      console.log(config);

      firebase.initializeApp(config);

      //// Get Firebase Database reference.
      let firepadRef = this.getExampleRef();

      //// Create CodeMirror (with lineWrapping on).
      let codeMirror = CodeMirror(
        document.getElementById("firepad-container"),
        { lineWrapping: true }
      );  
      
      let editorWrapper = codeMirror.getWrapperElement();

      //// Create Firepad (with rich text toolbar and shortcuts enabled).
      let firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextToolbar: true,
        richTextShortcuts: true
      });

      //// Initialize contents.
      // firepad.on('ready', function() {
      //   if (firepad.isHistoryEmpty()) {
      //     firepad.setHtml('<span style="font-size: 24px;">Rich-text editing with <span style="color: red">Firepad!</span></span><br/><br/>Collaborative-editing made easy.\n');
      //   }
      // });
    },

    // Helper to get hash from end of URL or generate a random one.
    getExampleRef() {
      let ref = firebase.database().ref();
      
      // let hash = window.location.hash.replace(/#/g, "");
      // if (hash) {
      //   ref = ref.child(1);

      // } else {
      //   // ref = ref.push(); // generate unique location.
      //   ref = ref.child(1);
      //   // window.location = window.location + "#" + ref.key; // add it as a hash to the URL.
      // }
      ref = ref.child(this.study_id);
      // if (typeof console !== "undefined") {
      //   console.log("Firebase data: ", ref.toString());
      // }
      return ref;
    }
  },
  mounted() {
    this.init();
  },
  created() {
  }
};
</script>

<style scoped>
#firepad-container {
  width: 640px;
  height: 640px;
}


</style>
