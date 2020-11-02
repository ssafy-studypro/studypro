<template>
  <v-card>
    <!-- <div id="editor" /> -->
    <editor
      id="editor"
      height="653px"
      v-model="editorText"
      previewStyle="vertical"
      :options="defaultOptions"
      mode="markdown"
      @load="load_editor"
      @change="change_editor"
    />
    <v-tooltip bottom>
      <template v-slot:activator="{on}">
        <v-btn class="btns" id="download" v-on="on" @click="click_down" icon>
          <v-icon color="black">save</v-icon>
        </v-btn>
      </template>
      <span>Save</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{on}">
        <v-btn class="btns" id="upload" @click="click_upload" v-on="on" icon>
          <v-icon color="black">folder_open</v-icon>
        </v-btn>
      </template>
      <span>Load</span>
    </v-tooltip>

    <input id="file_load" type="file" accept=".txt, .md" @change="load_file" hidden />
  </v-card>
</template>
<script>
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";
import { Editor } from "@toast-ui/vue-editor";

export default {
  props: ["socket", "study_id"],
  components: {
    editor: Editor
  },

  data() {
    return {
      editor: "",
      editorText: "",
      defaultOptions: {
        language: "en_US",
        useCommandShortcut: true,
        useDefaultHTMLSanitizer: true,
        usageStatistics: true,
        hideModeSwitch: true,
        toolbarItems: [
          "heading",
          "bold",
          "italic",
          "strike",
          "divider",
          "hr",
          "quote",
          "divider",
          "ul",
          "ol",
          "task",
          "indent",
          "outdent",
          "divider",
          "table",
          "image",
          "link",
          "divider",
          "code",
          "codeblock"
        ]
      },
      is_change: false
    };
  },
  methods: {
    saveToFile_Chrome(fileName, content) {
      let blob = new Blob([content], { type: "text/plain" });
      let objURL = window.URL.createObjectURL(blob);

      // 이전에 생성된 메모리 해제
      if (window.__Xr_objURL_forCreatingFile__) {
        window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
      }
      window.__Xr_objURL_forCreatingFile__ = objURL;
      // let down = document.getElementById("download");
      let down = document.createElement("a");
      down.download = fileName;
      down.href = objURL;
      down.click();
    },
    isIE() {
      return (
        (navigator.appName === "Netscape" &&
          navigator.userAgent.search("Trident") !== -1) ||
        navigator.userAgent.toLowerCase().indexOf("msie") !== -1
      );
    },

    click_down() {
      let today = new Date();
      let year = String(today.getFullYear());
      let month = String(today.getMonth() + 1);
      let day = String(today.getDay());
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let title = year + month + day;
      this.saveToFile_Chrome(title, this.editorText);
    },

    async load_file(event) {
      let value = await event.target.files[0].text();
      this.editorText = value;
      this.socket.emit("typing", {
        study_id: this.study_id,
        text: this.editorText
      });
    },
    click_upload() {
      document.getElementById("file_load").click();
    },
    load_editor() {
      console.log("로딩완료");
      
      this.is_change = true;
    },
    change_editor(event) {
      if(event.source == "wysiwyg"){
        return;
      }
      if (this.is_change) {
        console.log("보낸다");
        this.socket.emit("typing", {
          study_id: this.study_id,
          text: this.editorText
        });
      }
    }
  },
  mounted() {
    this.socket.emit("load_pad", {
      study_id: this.study_id
    });

    window.onload = () => {
      this.is_change = true;
    };
    document.getElementById("editor").onload = () => {
      this.is_change = true;
    };

    this.socket.on("typing", data => {
      console.log("받아오나?");

      this.is_change = false;
      this.editorText = data.text;
      console.log(data.text);

      this.is_change = true;
    });

    this.socket.on("load_pad", data => {
      let pad_data = this.editorText;
      this.socket.emit("send_pad", {
        socket_id: data,
        pad_data: pad_data
      });
    });

    this.socket.on("send_pad", data => {
      this.is_change = false;
      this.editorText = data.pad_data;
      this.is_change = true;
    });
  }
};
</script>
<style  scoped>
#editor {
  z-index: 1;
}

.btns {
  top: -2px;
  position: absolute;
  z-index: 2;
  font-family: fantasy;
  font-weight: bold;
}
#upload {
  left: 1070px;
}
#download {
  left: 1105px;
}
</style>
