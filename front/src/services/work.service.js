import axios from 'axios'
import AuthHeader from './auth.header'

const URL = process.env.VUE_APP_API_URL + 'works/'

class workService {

    getWorks(payload) {
        AuthHeader.changeHeadersToken()
        return axios.get(URL, {
            params: payload
        }).then(res => {
            return res.data
        })
    }

    createWork(payload) {
        AuthHeader.changeHeadersToken()
        return axios.post(URL, { payload })
            .then(res => {
                return res.data;
            })
    }

    deleteWork(payload) {
        AuthHeader.changeHeadersToken()
        return axios.delete(URL, { data: payload })
            .then(res => {
                return res.data
            })
    }

    updateWork(payload) {
        AuthHeader.changeHeadersToken()
        return axios.put(URL, { payload })
            .then(res => {
                return res.data
            })
    }
}

export default new workService()