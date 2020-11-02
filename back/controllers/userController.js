import {users, users_and_studies, studies, minor_classes, days} from "../models"
import path from "path"
import multer from "multer"
import jwt from "jsonwebtoken"

export const signin = async function(req, res) {
    try{
        const {email, password} = req.body;
        const user = await users.findOne( {where: {email,platform_type:"local"}});
        if (user) {
            const pass = await user.verify(password);
            if (pass) {
                let accessToken = await user.getToken()
                res.json({
                    state: "success",
                    user: {
                        uid: user.dataValues.id,
                        nickname: user.dataValues.nickname,
                        profile_url: user.dataValues.profile_url,
                        accessToken: accessToken
                    }
                })
            }
            else {   
                res.json({state:"fail"}); 
            }
        } else {
            res.json({state:"fail"});
        }
    } catch(err) {
        res.send(err)
    }
};     


export const social_signin = async function(req, res) {
    try{
        const {email, nickname, gender, platform_type, profile_image} = req.body;
        console.log(req.body)
        let user = await users.findOne({ where: { email, platform_type } });
        if (!user) {
            user = await users.save({
                email,
                nickname,
                gender,
                profile_url: profile_image
            },
            platform_type
            );
        }
        let accessToken = await user.getToken()
            res.json({
                state: "success",
                user: {
                    uid: user.dataValues.id,
                    nickname: user.dataValues.nickname,
                    profile_url: user.dataValues.profile_url,
                    accessToken: accessToken
                }
            })
    } catch (err) {
        console.log(err);
    }

}

// 세션 유지 확인을 위한 토큰 확인 + 확인 후 유저 정보 전송
export const check_token = async function(req, res) {
    try{
        const accessToken = req.header('Authorization')

        if (accessToken) {
            const decoded = await jwt.verify(accessToken, process.env.SECRET_KEY)
            if (decoded) {
                const user = await users.findOne({ where: { id: decoded.user_id } });
                const newAccessToken = await user.getToken()
                res.json({
                    state: "success",
                    user: {
                        uid: user.dataValues.id,
                        nickname: user.dataValues.nickname,
                        profile_url: user.dataValues.profile_url,
                        accessToken: newAccessToken }
                })
            } else {
                res.json({state: "fail", detail: "unable token"})
            }
        } else {
            res.json({state: "fail", detail: "not token"})
        }
    } catch (err) {
        res.send(err)
    }
}


export const read_users = function(req, res) {
    try{
        users.findAll({})
            .map(user => {
                delete user.dataValues.password
                delete user.dataValues.auth
                return user
        }).then(user => {
            res.send(user)
        });
    } catch (err) {
        res.send(err)
    }
}

export const read_user = async (req, res) => {
    try{
        const user = await users.findOne({where: {id:req.params.user_id}})
        delete user.dataValues.password
        delete user.dataValues.auth
        res.send(user);
    } catch (err) {
        res.send(err)
    }
}

export const update_user = async (req, res) => {
    try{
        const user = res.locals.user;
        const {
            body: {name, nickname, phone, image_update, about},
        } = req;
        const filename = (typeof req.file === 'undefined') ? "profile_default.png"  : req.file.filename
        
        users.update({
            name, nickname, phone, about,
            profile_url: (image_update === 'true' ? process.env.IMAGE_URL + filename : user.profile_url),
            },{where: {id:user.id}
        }).then(user => {
            res.send(user)
        });
    } catch (err) {
        res.send(err)
    }
}

export const update_password = async (req, res) => {
    try{
        const user = res.locals.user;
        const {new_password, password} = req.body;
        
        if(user) {
            users.findOne({where:{id:user.id}})
                .then(async (user) => {
                    const pass = await user.verify(password)            
                    if (pass) {
                        const new_pass = await users.hash(new_password)
                        const update_user = users.update({password:new_pass}, {where:{id:user.id}})
                        if (update_user) {
                            res.json({state: "success"})
                        } else {
                            res.json({state: "fail"})
                        }
                    }else {
                        res.json({state: "fail", detail:"not pass"})
                    }
                })
        } else {
            res.json({state: "fail", detail:"not login"})
        }
    } catch (err) {
        res.send(err)
    }
}
export const delete_user = async (req, res) => {
    try{
        const user = await users.destroy({where: {id:req.params.user_id}})
        res.json({user});
    } catch (err) {
        res.send(err)
    }
}


export const signup = async function(req, res, next) {
    try{
        const {
            body:{email, password, name, nickname, gender, phone, about},
        } = req;
        console.log(about)
        const filename = (typeof req.file === 'undefined') ? "profile_default.png"  : req.file.filename

        const user = await users.findOne({where: {email, platform_type:"local"}})
    
        if(user) {
            res.json( {state: "fail", detail: "userEmail exist"});
            throw new Error("userEmail exist");
        }
        else {
            const new_user = await users.save({
                email, password, name, nickname, gender, phone, about,
                profile_url: process.env.IMAGE_URL + filename,
            }, "local");

            if (new_user) {
                res.json( {state:"success"});
            } else {
                res.json( {state:"fail", detail: "not save"});
            }
        }
    } catch (err) {
        res.send(err)
    }          

}

export const profile_upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, process.env.IMAGE_PATH);
        }, 
        filename: function(req, file, cb) {
            cb(null , new Date().valueOf() + path.extname(file.originalname));
        }
    })
});


export const get_joined_study = function(req, res) {
    try{
        const user = res.locals.user;
        if (user){
            users_and_studies.findAll({where:{user_id:user.id}})
                .map(async (joined) => {
                    
                    const joined_study = await studies.findOne({where:{id:joined.dataValues.study_id}})
                    joined_study.dataValues.membership_level = joined.dataValues.level
                    
                    const captain = await users.findOne({where:{id:joined_study.dataValues.captain}})
                    delete captain.dataValues.password
                    delete captain.dataValues.auth
                    joined_study.dataValues.captain = captain.dataValues

                    const minor =  await minor_classes.findOne({where:{id:joined_study.dataValues.minor_class_id}});
                    delete minor.dataValues.id
                    joined_study.dataValues.minor_class = minor
                    delete joined_study.dataValues.minor_class_id
                    
                    const process_days = await days.read_days(joined.dataValues.study_id)
                    joined_study.dataValues.process_days = process_days

                    const num_joined_student  = await users_and_studies.count({where:{study_id:joined.dataValues.study_id}})
                    joined_study.dataValues.num_joined_student = num_joined_student

                    return joined_study;
                }).then(joined_studies => {
                    res.send(joined_studies)
                })
        } else {
            res.send({detail:"not available token"})
        }

    } catch(err) {
        res.send(err)
    }
}

export const leave_study = function(req, res) {
    try{
        const user = res.locals.user;
        const {study_id} = req.body;
        
        if (user && study_id) {
            const des_res = users_and_studies.destroy({where:{user_id:user.id, study_id}})
            if (des_res) {
                res.send({state:"success"})
            } else {
                res.send({detail:"not available token"})
            }
        } else {
            res.send({detail:"not available token"})
        }
    } catch (err) {
        res.send(err)
    }
};

export const image_url_update = function(req, res) {
    users.findAll()
        .map(user => {
            const profile_url = user.dataValues.profile_url;
            const new_profile_url = profile_url.replace(process.env.OLD_IMAGE_URL, process.env.IMAGE_URL)
            console.log(profile_url, new_profile_url)
            users.update({profile_url: new_profile_url}, {where:{id:user.dataValues.id}})
        })
}