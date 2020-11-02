import axios from 'axios'

const URL = process.env.VUE_APP_API_URL + "email/";

class EmailService {
    noticeApply(user_email, study_name, study_id) {
        return axios.post(URL + "notice_apply", {
            user_email: user_email,
            study_name: study_name,
            study_id: study_id
        }
        )
    }
    resultApply(user_email, study_name, study_id, result) {
        return axios.post(URL + "result_apply", {
            user_email: user_email,
            study_name: study_name,
            study_id: study_id,
            result: result
        }
        )
    }

    noticeDrop(user_email, study_name, study_id) {
        return axios.post(URL + "notice_drop", {
            user_email: user_email,
            study_name: study_name,
            study_id: study_id
        }
        )
    }
}

export default new EmailService()