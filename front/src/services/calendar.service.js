import axios from 'axios'
import AuthHeader from './auth.header'

const URL = process.env.VUE_APP_API_URL + 'works/'

class CalendarService {
    getIssue(payload) {
        AuthHeader.changeHeadersToken();
        axios.get(URL, payload)
            .then(res => {
                return res.data
            })
    }
}

export default new CalendarService()