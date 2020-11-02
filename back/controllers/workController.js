import {study_works, personal_works, users, studies} from "../models"

//req.body.study가 1이면 스터디 일정, 0이면 개인 일정

export const create_work = async function(req, res) {
    try{
        const writer = res.locals.user;
        const {name, content, dates, type, study_id, start_time, end_time,status} = req.body.payload;
        
        
        const user_info = await users.findOne({where: {id:writer.id}})
        let user_nickname = user_info.nickname;
        let merged_date = '';
        
        for (let index = 0; index < dates.length-1; index++) {
            merged_date += dates[index]+"/";
        }
        merged_date += dates[dates.length-1];
        
        let work = '';
        if(type==='study'){
            const study_info = await studies.findOne({where:{id: study_id}})
            let study_name = study_info.name;
            work = await study_works.create({writer:writer.id, study_id, name, content, dates : merged_date, start_time, end_time,status, user_nickname,study_name, members:user_nickname })
        }else{
            work = await personal_works.create({writer:writer.id, name, content, dates : merged_date, start_time, end_time,status, user_nickname, members:user_nickname })
        }
        
        res.send({state:'success'})
    } catch (err) {
        console.log(err);
        
        res.send({state:'fail'})
    }
}

export const read_work = async function(req, res) {
    try{
        
        const writer = res.locals.user;
        const {type, study_id} = req.query;
        const works = (type === 'study') ? study_works : personal_works

        if (type === "personal") {
            const work = await works.findAll({where:{writer:writer.id}})
            work.forEach(element => {
                element.dataValues.type ="personal"
                
            });
            res.send(work)
        } else {
            const work = await works.findAll({where:{study_id}})
            work.forEach(element => {
                element.dataValues.type ="study"
            });
            res.send(work)
        }
    } catch(err) {
        res.send(err)
    }
}
        

export const delete_work = async function(req, res) {
    try{
        const writer = res.locals.user;
        const {type, work_id} = req.body;
        
        const works = (type === 'study') ? study_works : personal_works
        
        const result = await works.destroy({where:{id:work_id}});
        res.send({state:'success'});
    } catch (err) {
        res.send({state:'fail'});
    }
}

export const update_work = async function(req, res) {
    try{
        const writer = res.locals.user;
        const {name, content, dates , type, start_time, end_time,status, work_id,members} = req.body.payload;
        const works = (type === 'study') ? study_works : personal_works

        let merged_date = '';
        for (let index = 0; index < dates.length-1; index++) {
            merged_date += dates[index]+"/";
        }
        merged_date += dates[dates.length-1];
        
        const result = await works.update({name, content,dates:merged_date, start_time, end_time, status,members}, {where:{id:work_id}});
        res.send({state:'success'});

    } catch(err) {
        console.log(err);
        
        res.send({state:'fail'});
    }
}

