import AuthService from '@/services/auth.service'
import WbKakao from "@/social-signin/kakao/kakao";

const local = JSON.parse(localStorage.getItem('user'))
const session = JSON.parse(sessionStorage.getItem('user'))
const user = local || session
const initialState = user ? { status: { isLogged: true }, user: user } : { status: { isLogged: false }, user: null }

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        // 초기 유저정보 업데이트
        checkUserDefault({ commit }) {
            if (!initialState.user) return

            AuthService.checkUserDefault().then(
                user => {
                    if (user) {
                        commit('loginSuccess', user)
                    } else {
                        commit('loginFailure')
                    }
                }
            )
        },

        // 로그인
        async login({ commit }, user) {
            let complete = await AuthService.login(user).then(
                res => {
                    if (res) {
                        return res
                    } else {
                        return res
                    }
                },
                () => { // error
                    return false
                }
            )

            if (complete) {
                commit('loginSuccess', complete)
                return true
            } else {
                commit('loginFailure')
                return false
            }
        },

        // 소셜 로그인
        async socialLogin({ commit }, user) {
            let complete = await AuthService.socialLogin(user).then(
                res => {
                    if (res) {
                        return res
                    } else {
                        return res
                    }
                },
                () => { // error
                    return false
                }
            )

            if (complete) {
                commit('loginSuccess', complete)
                return true
            } else {
                commit('loginFailure')
                return false
            }
        },

        // 로그아웃
        async logout({ commit }) {
            await AuthService.logout()
            WbKakao.signout();
            commit('logout')
        },

        // 회원가입
        async register({ commit }, formData) {
            return await AuthService.register(formData).then(
                () => { //response
                    commit('registerSuccess')
                    return true
                },
                () => { //errors
                    commit('registerFailure')
                    return false
                }
            )
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status = { isLogged: true }
            state.user = user
        },
        loginFailure(state) {
            state.status = { isLogged: false }
            state.user = null
        },
        logout(state) {
            state.status = { isLogged: false }
            state.user = null
        },
        registerSuccess(state) {
            state.status = { isLogged: false }
        },
        registerFailure(state) {
            state.status = { isLogged: false }
        }
    },
    getters: {
        isAuth: (state) => {
            return state.status.isLogged
        },
        getUser: (state) => {
            return state.user
        },
        getToken: (state) => {
            return state.user.accessToken
        }
    }
}