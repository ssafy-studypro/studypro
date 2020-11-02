import axios from 'axios'


class ClassService {
    getAllMajorClass() {
        return axios.get(process.env.VUE_APP_API_URL + 'class/major')
            .then(res => {
                return Promise.resolve(res.data)
            })
    }

    getMinorClass(majorID) {
        return axios.get(process.env.VUE_APP_API_URL + 'class/minor', {
                params: {
                    major: majorID
                }
            })
            .then(res => {
                return Promise.resolve(res.data)
            })
    }

    getMinorClassByUid(payload) {
        return axios.get(process.env.VUE_APP_API_URL + 'minor', {
            params: {
                uid: payload.uid
            }
        })
    }
}

export default new ClassService()