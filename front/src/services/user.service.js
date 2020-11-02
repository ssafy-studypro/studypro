import axios from 'axios'
import AuthHeader from './auth.header'

const URL = process.env.VUE_APP_API_URL + 'users/'

class UserService {
    // 회원정보 요청요청 - GET - 'users/:uid'
    getUserContent(uid) {
        AuthHeader.changeHeadersToken()
        return axios.get(URL + uid)
            .then(res => {
                return res.data
            })
    }

    getAllUser() {
        return axios.get(URL)
    }

    // 회원정보 수정 - PUT - 'users/:uid'
    updateUser(payload) {
        AuthHeader.changeHeadersToken()
        return axios.put(URL, payload)
            .then(res => {
                return res.data
            })
    }

    // 비밀번호 변경
    changePass(payload) {
        AuthHeader.changeHeadersToken()
        return axios.put(URL + 'pass', payload)
            .then(res => {
                return res.data
            })
    }

    // 가입 그룹 목록 요청
    getMyGroups() {
        AuthHeader.changeHeadersToken()
        return axios.get(URL + 'joined-study')
            .then(res => {
                return res.data
            })
    }

    // 유저 정보 요청
    getUserById(uid) {
        return axios.get(URL + uid)
            .then(res => {
                return res
            })
    }
}

export default new UserService()