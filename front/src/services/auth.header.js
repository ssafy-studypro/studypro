import axios from 'axios'

class AuthHeader {
    getToken() {
        let local = JSON.parse(localStorage.getItem('user'))
        let session = JSON.parse(sessionStorage.getItem('user'))
        let user = local || session
        if (user && user.accessToken) {
            return user.accessToken
        } else {
            return {}
        }
    }

    // 헤더에 포함되는 토큰 업데이트
    changeHeadersToken() {
        axios.defaults.headers.common['Authorization'] = this.getToken();
    }
}

export default new AuthHeader()