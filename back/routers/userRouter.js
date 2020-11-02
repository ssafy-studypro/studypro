import express from "express"
import routes from "../routes"
import path from "path"
import { 
    read_users, 
    read_user, 
    update_user, 
    delete_user,
    signup, 
    signin,
    social_signin,
    check_token,
    profile_upload,
    update_password,
    get_joined_study,
    image_url_update,
    leave_study
} from "../controllers/userController"

const userRouter = express.Router();
//userRouter.get("/update", image_url_update)

userRouter.post(routes.signup, profile_upload.single('img'), signup);
userRouter.post(routes.signin, signin);
userRouter.post(routes.social_signin, social_signin);
userRouter.post(routes.check_token, check_token);
                            
userRouter.get(routes.joined_study, get_joined_study);
userRouter.get(routes.home, read_users);
userRouter.get(routes.userDetail, read_user);
userRouter.delete(routes.leave_study, leave_study)
userRouter.put(routes.home, profile_upload.single('img'), update_user);
userRouter.put(routes.update_password, update_password);

userRouter.delete(routes.userDetail, delete_user);
export default userRouter;