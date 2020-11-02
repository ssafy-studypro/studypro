import express from "express"
import routes from "../routes"
import {create_study, read_studies, join_study, delete_study, update_study, apply_study, destory_study,read_apply_study,
    get_joined_user, delete_study_user,update_study_user_level, attendence,read_today_attendence,image_url_update,
    read_study, search_studies, mark_study, read_marked_studies, study_image_upload} from "../controllers/studyController"
import {onlyPrivate} from "../middleware"

const studyRouter = express.Router();


studyRouter.get("/update", image_url_update)
studyRouter.get(routes.home, read_studies);
studyRouter.post(routes.home, study_image_upload.single('img'), create_study)
studyRouter.post(routes.change_level, update_study_user_level)
studyRouter.delete(routes.home, delete_study)
studyRouter.get(routes.study_apply, read_apply_study)
studyRouter.put(routes.study_detail, update_study)
studyRouter.get(routes.study_search, search_studies)
studyRouter.get(routes.study_mark, read_marked_studies)
studyRouter.get(routes.study_detail, read_study)
studyRouter.post(routes.study_mark, onlyPrivate, mark_study)
studyRouter.post(routes.study_join, join_study)
studyRouter.delete(routes.study_join, delete_study_user)
studyRouter.post(routes.study_apply , apply_study)
studyRouter.get(routes.study_join, get_joined_user)
studyRouter.post(routes.attendence,attendence)
studyRouter.post(routes.check_attendence,read_today_attendence);



export default studyRouter;
