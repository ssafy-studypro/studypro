import {users, studies, users_and_studies, applies, days, tags, studies_and_tags, marked_studies, minor_classes, attendences } from "../models"
import {study_posts as study_post_model, study_post_likes as study_post_like_model, study_comments as study_comment_model} from "../models"
import multer from "multer"
import path from "path"

const study_image_default = function () {
    return ("study_default"  + (Math.round(Math.random() * 2) + 1) + ".png")
}

export const create_study = async function(req, res) {
    const captain = res.locals.user;
    const {
        name, goal, description, minor_class_id, user_limit,
        start_day, end_day, start_time, end_time, isOpen, status, progress_days, input_tags
    } = req.body;

    const study = await studies.findOne({where:{name}})
    if (study) {
        res.send({state:"fail", detail:"study name exist"})
    } else {
        const filename = (typeof req.file === 'undefined') ? study_image_default() : req.file.filename
        //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", req.body)
        const new_study = await studies.create({
            name, goal, description, minor_class_id, user_limit, captain:captain.id,
            start_date:start_day, end_date:end_day, start_time, end_time, isopen:(isOpen === 'true' ? 1: 0), status, 
            image_url: process.env.IMAGE_URL + filename,
        }).then(study => {
            const study_id = study.dataValues.id
            users_and_studies.create({user_id:captain.id, study_id, level:"captain"})
            days.create_days(study_id, progress_days)
    
            return study
        }).then(async (study)=> {
            if (typeof input_tags === 'undefined') {
                res.send({state:"success", gid:study.dataValues.id})
            } else {
                for (const tag of input_tags) {
                    const temp_tag = await tags.findOne({where :{name:tag}})
                    if (temp_tag) {
                        studies_and_tags.create_study_tag(study_id, temp_tag.id)
                    }
                    else {
                        const created_tag = await tags.create_tag(tag)
                        studies_and_tags.create_study_tag(study_id, created_tag.id)
                    }
                }
                res.send({state:"success", gid:study.dataValues.id})
            }
        })
    }
}

export const apply_study = async function(req, res) {
    try{
        const user = res.locals.user;
        const {study_id, comment} = req.body
        
        const study = await studies.findOne({where:{id:study_id}})
        
        if (study && user) {
            const existing_user = await users_and_studies.findOne({where:{user_id:user.id, study_id}})
            if (existing_user) {
                res.send({state:"fail", detail:"이미 가입된 사용자입니다."})
                return;
            }
            const apply = await applies.findOne({where:{study_id, user_id:user.id}})
            if (apply) {
                res.send({state:"fail", detail:"가입 대기 중입니다."})
                return;
            } else {
                const new_apply = await applies.create({study_id, user_id:user.id, comment:comment}) 
                res.send({state:"success", new_apply})
            }
        } else {
            res.send({state:"fail"})
        }
    } catch(err) {
        res.send(err)
    }
}

export const read_apply_study = async function(req, res) {
    try  {
        const {study_id} = req.query;
        
        applies.findAll({where:{study_id}})
            .map(async (read_apply)=>{
                const user = await users.findOne({where:{id:read_apply.dataValues.user_id}})
                delete user.dataValues.password
                delete user.dataValues.auth
                read_apply.dataValues.user = user.dataValues
                return read_apply
            })
            .then(read_applies => {
                res.send(read_applies)
            })
        

    } catch (err) {
        res.send(err)
    }
}


export const join_study = async function(req, res) {
    const {apply_id, accept} = req.body
    const apply = await applies.findOne({where:{id:apply_id}})
    if (apply) {
        const user_id = apply.dataValues.user_id;
        const study_id = apply.dataValues.study_id;
        if (accept) {
            const join = await users_and_studies.findOrCreate({
                where: {user_id, study_id},
                defaults:{level:"silver"}})
            if (join) {
                res.send({state:"success"})
            } else {
                res.send({state:"fail", detail:"이미 가입된 사람입니다."})
            }
        } else { 
            res.send({state:"success"})
        }
        apply.destroy();
    } else {
        res.send({state:"fail"})
    }
}

export const get_joined_user = async function(req, res) {
    try{
       const {study_id} = req.query
        users_and_studies.findAll({where:{study_id}})
            .map(async (res)=>{
                const user = await users.findOne({where:{id:res.dataValues.user_id}})
                const level = await users_and_studies.findOne({where:{user_id:res.dataValues.user_id, study_id}})
                user.dataValues.level = level.dataValues.level
                return user;})
            .then((users) =>{
                res.send(users)
            })
    } catch(err) {
        res.send(err);
    }
}

export const update_study_user_level = async function(req, res) {
    try{
        const captain = res.locals.user;
        const {user_id, study_id, level} = req.body;

        const study_captain = await users_and_studies.findOne({where:{user_id:captain.id, study_id}})
        if (!study_captain) {
            res.send({state:"당신은 캡틴이 아닙니다."})
            return;
        }
        const joined_user = await users_and_studies.update({level}, {where:{user_id, study_id}})
        if (joined_user) {
            res.send({state:"success"})
        } else {
            res.send({state:"fail"})
        }
    } catch(err) {
        res.send(err)
    }
}

export const delete_study_user = async function (req, res) {
    try{
        const {study_id, user_id} = req.body;
        const result = await users_and_studies.destroy({where:{study_id, user_id}})
        if (result) {
            res.send({state:"success"})
        } else {
            res.send({state:"fail"})
        }

    } catch(err) {
        res.send(err)
    }
}


export const destory_study = async function(req, res) {
    try{
        const captain = res.locals.user;
        const {study_id} =  req.body;

        // 댓글, 게시판, 유저와 스터디, 스터디, 스터디승인, 데이즈, 스터디 할일
        if (captain) {
            studies.findOne({where:{id:study_id}})
                .then(async (study) => {
                    if (study.dataValues.captain != captain.id) {
                        res.send({detail:"당신은 캡틴이 아닙니다."})
                        throw new Error("당신은 캡틴이 아닙니다.")
                    }
                })
                .then(async ()=>{
                    await days.destroy({where:{study_id}})
                    await applies.destroy({where:{study_id}})
                    const posts = await study_post_model.findAll({where:{study_id}})
                    return posts;
                })
                .map(async (post)=>{
                    const post_id = post.dataValues.id
                    await study_comment_model.destroy({where:{post_id}})
                    await study_post_likes.destroy({where:{post_id}})
                    return post;
                })
                .then(async ()=>{
                    await users_and_studies.destroy({where:{study_id}})
                    await studies.destroy({where:{id:study_id}})
                    res.send({state:"success"})
                })
                .catch(function(err){
                    res.send(err)
                })
        } else {
            res.send(result)
        }
    } catch(err) {
        console.log(err)
    }

}

export const update_study = async function(req, res) {
    const study_id =  req.query.study_id
    const user_id = res.locals.user.id;

    const result = await studies.update_study(study_id, req.body, user_id)
    res.send(result)
}

export const read_studies = async function(req, res) {
    try{
        studies.findAll({
            order:  [['created_date','DESC']]
            }).map(async study => {
                const minor =  await minor_classes.findOne({where:{id:study.dataValues.minor_class_id}});
                study.dataValues.minor_class = minor
                delete study.dataValues.minor_class_id

                const captain = await users.findOne({where:{id:study.dataValues.captain}})
                delete captain.dataValues.password
                delete captain.dataValues.auth
                study.dataValues.captain = captain.dataValues

                const num_joined_student  = await users_and_studies.count({where:{study_id:study.dataValues.id}})
                study.dataValues.num_joined_student = num_joined_student

                const process_days = await days.read_days(study.dataValues.id)
                study.dataValues.process_days = process_days

                return study
            }).then(studies => {
                res.send(studies)
            })
    } catch(err) {

    }
}

export const read_study = async function(req, res) {
    try{
        const {study_id} = req.query
        const user = res.locals.user;
        
        const study = await studies.findOne({where:{id:study_id}})
        const num_joined_student  = await users_and_studies.count({where:{study_id:study_id}})
        if (study){
            if (user){
                const level = await users_and_studies.findOne({where:{study_id, user_id:user.id}})
                if (level){
                    study.dataValues.level = level.dataValues.level
                }  
            }
            study.dataValues.num_joined_student = num_joined_student;
            res.send(study)
        } else {
            res.send({state:"fail", detail:"존재하지 않는 스터디입니다."})
        }
    } catch(err) {
        res.send(err)
    }
}

export const search_studies = async function(req, res) {
    const searching_captain = req.body.captain ? await users.findOne({where:{name: req.body.captain}}) : undefined
    const searching_minor_class = req.body.minor_class ? await minor_classes.findOne({where:{name: req.body.minor_class}}) : undefined
    const searching_major_class = req.body.major_class ? await major_classes.findOne({where:{name: req.body.major_class}}) : undefined
    const searching_tag = req.body.tag ? await tags.findOne({where:{name: req.body.tag}}) : undefined
    const input_days = req.body.days ? req.body.days.replace('[', '').replace(']', '').replace(/ /g,'').split(',') : []

    const searching_captain_id = searching_captain ? searching_captain.id : -1
    const searching_minor_class_id = searching_minor_class ? searching_minor_class.id : -1
    const searching_major_class_id = searching_major_class ? searching_major_class.id : -1
    const searching_tag_id = searching_tag ? searching_tag.id : -1

    const user_id = req.body.user_id ? req.body.user_id : -1
    const id_data = {tag_id: searching_tag_id, captain_id : searching_captain_id, minor_class_id:searching_minor_class_id, major_class_id: searching_major_class_id}
    const temp_result = await studies.search_studies(req.body, id_data)
    const result = []
    let study, captain, like, is_joined, day, study_day, flag, study_tag
    for (study of temp_result) {
        flag = true
        captain = await users.findOne({where:{id:study.dataValues.captain}})
        like = await marked_studies.findOne({where:{user_id, study_id:study.dataValues.id}}) ? true : false
        is_joined = await users_and_studies.findOne({where:{user_id, study_id:study.dataValues.id}}) ? true : false

        delete captain.dataValues.password
        delete captain.dataValues.auth
        delete study.dataValues.captain

        study.dataValues.captain = captain
        study.dataValues.like = like
        study.dataValues.is_joined = is_joined

        for (day of input_days) {
            study_day = await days.findOne({where:{day, study_id: study.dataValues.id}})
            if (!study_day) flag = false
        }
        if (searching_tag) {
            study_tag = await studies_and_tags.findOne({where:{tag_id:searching_tag_id, study_id: study.dataValues.id}})
            if (!study_tag) flag = false
        }

        if (flag) result.push(study)
    }

    res.send(result)
}

export const mark_study = async function(req, res) {
    const study_id = req.query.study_id
    const user_id = res.locals.user.id;

    const result = await marked_studies.mark_study(user_id, study_id)
    res.send(result)
}

export const read_marked_studies = async function(req, res) {
    const user_id = res.locals.user.id;

    const markings = await marked_studies.findAll({where:{user_id}})
    let result = [], marking

    for (marking of markings) {
        const marked_study = await studies.read_study(marking.study_id)
        result.push(marked_study)
    }

    res.send(result)
}

export const study_image_upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, process.env.IMAGE_PATH);
        }, 
        filename: function(req, file, cb) {
            cb(null , new Date().valueOf() + path.extname(file.originalname));
        }
    })
});


export const read_today_attendence = async function (req, res) {
    
    
    try {
        const user = res.locals.user;
        
        const {study_id,user_id,date} = req.body;
        
        let today_attendence = await attendences.read_today_attendence(study_id, user_id,date)
        
        
        if (today_attendence) {
            res.send({ state: "true" })
        } else {
            res.send({ state: "false" })
        }
    } catch (err) {
        console.log(err);
        
        res.send(err)
    }
};

export const attendence = function (req, res) {
    
    try {
        const user = res.locals.user;
        const {study_id,user_id} = req.body;

        let today_attendence = attendences.create_attendence(study_id, user_id)
        if (today_attendence) {
            res.send({ state: "success" })
        } else {
            res.send({ state: "fail" })
        }
    } catch (err) {
        res.send(err)
    }
};


export const image_url_update = function(req, res) {
    studies.findAll()
        .map(study => {
            const image_url = study.dataValues.image_url;
            console.log(image_url)
            const new_image_url = image_url.replace(process.env.OLD_IMAGE_URL, process.env.IMAGE_URL)
            console.log(image_url, new_image_url)
            studies.update({image_url: new_image_url}, {where:{id:study.dataValues.id}})
        })
};

export const delete_study = (req,res) => {
    try {
        console.log(req.body);
        const {study_id, user_id} = req.body;
        
        let result = studies.delete_study(study_id, user_id);
        res.send({state:'success'})
    } catch (error) {
        res.send({state: 'fail'})    
        console.log(error);
        
    }



}
