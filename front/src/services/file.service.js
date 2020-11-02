import axios from 'axios'

const URL = process.env.VUE_APP_API_URL + "files/"

class FileService {
    downloadFile(filename) {
        return axios({
            url: URL + filename,
            method: "GET",
            responseType: "blob" // important
        })
    }


}

export default new FileService()