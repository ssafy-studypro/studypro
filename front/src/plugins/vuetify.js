import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

export default new Vuetify({
    icons: { iconfont: "md" },
    theme: {
        themes: {
            light: {
                customTheme: "#404040",
                customOrange: "#E48E58",
                greenC: "#fbf4f9",
                redC: "#ffd5e5",
                blueC: "#f1fcfc",
                greyC: "#e9e2d0",
            },
        },
    },
})