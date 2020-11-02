import axios from 'axios'
import AuthHeader from './auth.header'

const URL = process.env.VUE_APP_API_URL + "alarms/";

class AlarmService {
    getReceivedAlarm() {
        return axios.get(URL, {
            params: {
                direction: "toUser"
            }
        })
    }

    getSendAlarm() {
        return axios.get(URL, {
            params: {
                direction: "fromUser"
            }
        })
    }

    sendAlarm(payload) {
        const { to, title, content } = payload
        return axios.post(URL, {
            to,
            title,
            content
        })

    }

    checkAlarm(payload) {
        return axios.put(URL, {
            alarm_id: payload.alarm_id
        })
    }

    getAlarmNumber() {
        AuthHeader.changeHeadersToken();
        return axios.get(URL + "number")
    }
}

export default new AlarmService()