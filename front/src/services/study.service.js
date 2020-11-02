import axios from 'axios'
import AuthHeader from './auth.header'

const URL = process.env.VUE_APP_API_URL + 'studies/'

class StudyService {
    getAllStudy() {
        AuthHeader.changeHeadersToken()
        return axios.get(URL)
            .then(res => {
                    return Promise.resolve(res.data)
                },
                error => {
                    return Promise.reject(error.data)
                })
    }

    // // 스터디 검색에 들어가는 내용들이 있어야 한다.
    // getStudy(payload) {
    //     //const { minorclass, majorclass}  = payload
    //     //return axios.get

    // }

    createStudy = (payload) => {
        // const {
        //     minor_class_id,	
        //     captain,		
        //     name,	
        //     goal,	
        //     description,		
        //     user_limit,		
        //     start_time,		
        //     end_time,		
        //     status,	
        //     start_date,	
        //     end_date,	
        //     isopen,	
        //     days,
        //     accessToken	
        // } = payload;
        AuthHeader.changeHeadersToken()
        return axios.post(URL,
                payload
            )
            .then(res => {
                return Promise.resolve(res.data)
            })
    }


    applyStudy(payload) {
        return axios.post(URL + "apply", {
            study_id: payload.study_id,
            comment: payload.comment
        })
    }

    getApplyList(payload) {
        return axios.get(URL + "apply", {
            params: {
                study_id: payload.study_id
            }
        })
    }

    joinStudy(payload) {
        return axios.post(URL + "join", {
            apply_id: payload.apply_id,
            accept: payload.accept
        })
    }

    getjoinedUser(payload) {
        return axios.get(URL + "join", {
            params: {
                study_id: payload.study_id
            }
        })
    }

    getStudyInfo(payload) {
        return axios.get(URL + "detail", {
            params: {
                study_id: payload.study_id
            }
        })
    }

    deleteUser(payload) {
        return axios.delete(URL + "join", {
            data: {
                study_id: payload.study_id,
                user_id: payload.user_id
            }

        })
    }

    changeUserLevel(payload) {
        return axios.post(URL + "change-level", {
            study_id: payload.study_id,
            user_id: payload.user_id,
            level: payload.level,
        })
    }

    checkAttendence(payload) {
        return axios.post(URL + "check_attendence", {
            study_id: payload.study_id,
            user_id: payload.user_id,
            date: payload.date,
        })
    }

    attendence(payload) {
        return axios.post(URL + "attendence", {
            study_id: payload.study_id,
            user_id: payload.user_id,
        })
    }

    destroyStudy(payload) {
        return axios.delete(URL, { data: payload })
            .then(res => {
                console.log(res)
                return res.data
            })
    }

}

export default new StudyService()