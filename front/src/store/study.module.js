import ClassService from '@/services/class.service'
import StudyService from '@/services/study.service'

export const study = {
    namespaced: true,
    actions: {
        // 대분류 요청
        getMajorClass() {
            return ClassService.getAllMajorClass()
        },

        // 대분류에 따른 소분류 요청
        getMinorClass({ dummy }, majorID) {
            console.log('getMinorClass in study.module.js', dummy)
            return ClassService.getMinorClass(majorID)
        },

        // 스터디 생성
        createStudy({ dummy }, payload) {
            console.log('createStudy in study.module.js', dummy)
            return StudyService.createStudy(payload)
        },

        // 스터디모임 전체 목록요청
        getAllStudy() {
            return StudyService.getAllStudy()
                .then(res => {
                    return res
                })
        }
    }
}