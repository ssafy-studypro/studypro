import Vue from 'vue';
import globalComponents from "./globalComponents";
import infiniteScroll from 'vue-infinite-scroll'

import "@/assets/vendor/font-awesome/css/font-awesome.css";
import "@/assets/scss/index.scss";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css'

//scrollbar
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

// sequential entrance
import SequentialEntrance from "vue-sequential-entrance";
import "vue-sequential-entrance/vue-sequential-entrance.css";

Vue.use(globalComponents);
Vue.use(infiniteScroll);
Vue.use(PerfectScrollbar)
Vue.use(SequentialEntrance);

export default {};