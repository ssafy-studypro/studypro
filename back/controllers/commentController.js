import {study_comments as study_comment_model} from "../models"
import {study_comment_likes as study_comment_like_model} from "../models";
import {common_comments as common_comment_model} from "../models"
import {common_comment_likes as common_comment_like_model} from "../models";
import {users} from "../models"

export const create_comment = async function(req, res){
    try{
       const user_id = res.locals.user.id;
       const {post_id, content, type} = req.body;

       let result;
       if(type ==="common"){
           result = await common_comment_model.create_comment(user_id, post_id, content);
       } else if (type === "study") {
           result = await study_comment_model.create_comment(user_id, post_id , content);
       }
        res.send("create ok");
    }catch(error){
        res.send('error')
    }
}


export const read_comments = async function(req, res){
    try{
        
        const {post_id, type} = req.query;
        let results;
        
        if(type === "common") {
            common_comment_model.findAll({where:{post_id:post_id}})
                .map(async (comment) => {
                    const user = await users.findOne({where:{id:comment.dataValues.writer}})
                    comment.dataValues.writer = user.dataValues;
                    return comment
                }).then(comments => {
                    res.send(comments)
                }) 
        } else if (type === "study") {
            study_comment_model.findAll({where:{post_id:post_id}})
                .map(async (comment) => {
                    const user = await users.findOne({where:{id:comment.dataValues.writer}})
                    comment.dataValues.writer = user.dataValues;
                    return comment
                }).then(comments => {
                    res.send(comments)
                }) 
        }
    //     if(user_id){
    //         let comment_id;
    //         for (const result of results) {
    //             let like;
    //             if(type === "common"){
    //                 comment_id = result.common_comment_id;
    //                 like = await study_comment_like_model.read_like(comment_id,user_id);
                    
    //             }else{
    //                 comment_id = result.study_comment_id;
    //                 like = await common_comment_like_model.read_like(comment_id,user_id);
    //             }

    //             if(like){
    //                 result.like = true;
    //             }else{
    //                 result.like = false;
    //             }
    //             console.log(result)
    //         }
    //     }
    //     res.send(results);
    
    }catch(error){
        console.log(error);
        res.send('error')
    }
}

export const update_comment = async function(req, res){
    try{
        const {comment_id, content, type} = req.body;
        let result;
        if(type === "common"){
            result = await common_comment_model.update_comment(comment_id, content);
        }else{
            result = await study_comment_model.update_comment(comment_id, content);
        }
        res.send("update ok");
    
    }catch(error){
        console.log(error);
        res.send('error')
    }
}

export const delete_comment = async function(req, res){
    try{
        const {comment_id, type} = req.body;
        let result;
        if(type === "common"){
            result = await common_comment_model.delete_comment(comment_id);
        }else{
            result = await study_comment_model.delete_comment(comment_id);
        }
        res.send("delete ok");
    
    }catch(error){
        console.log(error);
        res.send('error')
    }
}


export const create_like = async function(req, res){
    try{
        const {comment_id,user_id,type} = req.body;
               
        let result;
        if(type === "common"){
            result = await common_comment_like_model.create_like(comment_id,user_id);
        }else{
            result = await study_comment_like_model.create_like(comment_id,user_id);
        }
        res.send(result);
    
    }catch(error){
        console.log(error);
        res.send('error')
    }
}

export const delete_like = async function(req, res){
    try{
        const {comment_id, user_id, type} = req.body;
        let result;
        if(type === "common"){
            result = await common_comment_like_model.delete_like(comment_id,user_id);
        }else{
            result = await study_comment_like_model.delete_like(comment_id,user_id);
        }
        res.send('delete ok');
    
    }catch(error){
        console.log(error);
        res.send('error')
    }
}