import Vue from 'vue'
import Vuex from 'vuex'

import { auth } from './auth.module'
import { study } from './study.module'
import { user } from './user.module'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        study,
        user
    }
})