import {common_posts as common_post_model, common_post_likes as common_post_like_model} from "../models"
import {study_posts as study_post_model, study_post_likes as study_post_like_model} from "../models"
import {study_post_files, common_post_files} from "../models"
import {study_comments, common_comments} from "../models"
import {users} from "../models"
import multer from "multer"
import path from "path"

export const number_post = async function(req, res) {
    try {
        const {board, type, study_id} = req.query;
        let nPost;
        if(type === "common"){
            nPost = await common_post_model.count({where:{board}})
        } else if (type === "study") {
            nPost = await study_post_model.count({where:{study_id,board}})
        }
        res.json({post_number: nPost})
    } catch (err) {
        console.log(err)
        res.send('err')
    }
}

export const create_post = async function(req, res) {
    try {
        const writer = res.locals.user;
        const {study_id, title, content, board, type} = req.body;       
        const post_model = (type === 'common') ? common_post_model : study_post_model
        const post_file = (type === 'common') ? common_post_files : study_post_files
        
        const post = await post_model.create({writer:writer.id, title, content, board, study_id})
        if (post && req.files) {
            req.files.forEach(file => {
                post_file.create({post_id: post.dataValues.id, file_url: file.filename, file_name: file.originalname})
            });
        }
        res.send(post);
    } catch (error){
        console.log(error);
        res.send('error');
    }
}

export const update_post = async function(req, res) {
    try{
        const {post_id, title, content, type, board} = req.body;
        console.log("업데이트", req.body)
        let result;
        if(type === "common"){
            const post = await common_post_model.update({title, content, board}, {where: {id:post_id}})
            if (post) {
                res.send({state:"success"});
            } else {
                res.send({state: "fail"})
            }
        }else if(type ==="study"){
            const post = await study_post_model.update({title, content, board}, {where: {id:post_id}})
            if (post) {
                res.send({state:"success"});
            } else {
                res.send({state: "fail"})
            }
        }
    }catch(error){
        res.send("error");
    }
}

export const toggle_like = async function(req, res) {
    try{
        const user = res.locals.user
        const {post_id, type} = req.body;
        

        if(type === "common"){
            const like = await common_post_like_model.findOne( {where: {common_post_id:post_id, user_id:user.id}});
            if (like) {
                like.destroy();
                res.send({like: false})
            } else {
                common_post_like_model.create({common_post_id:post_id, user_id:user.id});
                res.send({like: true})
            }
        }else if(type === "study" && user){
            const like = await study_post_like_model.findOne( {where: {study_post_id:post_id, user_id:user.id}});
            if (like) {
                like.destroy();
                res.send({like: false})
            } else {
                study_post_like_model.create({study_post_id:post_id, user_id:user.id});
                res.send({like: true})
            }
        }
    }catch(error){
        console.log(error);
    }
}


export const read_post = async function(req, res) {
    try{
        const {post_id, type} = req.query;
        const user = res.locals.user

        let result;
        let like = false;
        if(type === "common"){
            common_post_model.findOne({where:{id:post_id}})
                .then(async (post) => {
                    const writer = await users.findOne( {where: {id:post.dataValues.writer}})
                    post.dataValues.writer = writer.dataValues.nickname
                    
                    if (user) {
                        const post_like = await common_post_like_model.findOne( {where: {common_post_id:post_id, user_id:user.id}});
                        post.dataValues.like = post_like ? true : false

                    } else {
                        post.dataValues.like = false
                    }
                    const post_num_like = await common_post_like_model.count( {where: {common_post_id:post_id}});
                    post.dataValues.num_like = post_num_like;

                    const view = post.dataValues.view
                    common_post_model.update({view:view+1}, {where:{id:post.dataValues.id}})

                    const files = await common_post_files.findAll( {where: {post_id:post_id}})
                    post.dataValues.files = files
                    
                    res.send(post)      
                })          
        }else if(type === "study"){
            study_post_model.findOne({where:{id:post_id}})
                .then(async (post) => {
                    const writer = await users.findOne( {where: {id:post.writer}})
                    post.dataValues.writer = writer.dataValues.nickname
                
                    if (user) {
                        const post_like = await study_post_like_model.findOne( {where: {study_post_id:post_id, user_id:user.id}});
                        post.dataValues.like = post_like ? true : false

                    } else {
                        post.dataValues.like = false
                    }
                    const post_num_like = await study_post_like_model.count( {where: {study_post_id:post_id}});
                    post.dataValues.num_like = post_num_like;
                    
                    const view = post.dataValues.view
                    study_post_model.update({view:view+1}, {where:{id:post.dataValues.id}})

                    const files = await study_post_files.findAll( {where: {post_id:post_id}})
                    post.dataValues.files = files
                    
                    res.send(post)
                })          
        }
    } catch(error){
        console.log(error);
        res.send("error");
    }
}

export const delete_post = async function(req, res) {
    try{
        const {post_id, type} = req.body;
        console.log(req.body)
        if(type ==="common"){
            const post = await common_post_model.findOne({where: {id:post_id}})
            if (post) {
                await common_post_like_model.destroy({where: {common_post_id:post_id}})
                await common_comments.destroy({where: {post_id:post_id}})
                await common_post_files.destroy({where: {post_id}})
                post.destroy()
                res.send({state: "success"});
            } else {
                res.send({state: "fail"})
            }
        }else if( type === "study"){
            const post = await study_post_model.findOne({where: {id:post_id}})
            if (post) {
                await study_post_like_model.destroy({where: {study_post_id:post_id}})
                await study_comments.destroy({where: {post_id:post_id}})
                await study_post_files.destroy({where: {post_id}})
                post.destroy()
                res.send({state: "success"});
            } else {
                res.send({state: "fail"})
            }
        }
    } catch (error){
        res.send("error");
    }
}


export const list_post = async function(req, res) {
    try{
        const {board, type, study_id, offset} = req.query;
        let result;
        if(type === "common"){
            common_post_model.findAll({ 
                offset: Number(offset || 0),
                limit: 10,
                where : {board},
                order:  [['id','DESC']]
            }).map(async (post) => {
                const writer_id = post.dataValues.writer
                const writer = await users.findOne({where:{id:writer_id}})
                post.dataValues.writer = writer.dataValues.nickname

                const post_id = post.dataValues.id
                const post_num_like = await common_post_like_model.count( {where: {common_post_id:post_id}});                
                post.dataValues.num_like = post_num_like
                
                return post

            }).then((posts)=>{   
                
                res.send(posts)
            })
        }else if(type === "study"){
            study_post_model.findAll({ 
                offset: Number(offset || 0),
                limit: 10,
                where : {
                    study_id : study_id,
                    board : board,
                },
                order:  [['id','DESC']]
            }).map(async (post) => {
                const writer_id = post.dataValues.writer
                const user = await users.findOne({where:{id:writer_id}})
                post.dataValues.writer = user.dataValues.nickname

                const post_id = post.dataValues.id
                const post_num_like = await study_post_like_model.count( {where: {study_post_id:post_id}});   
                post.dataValues.num_like = post_num_like

                return post
            }).then((posts)=>{
                res.send(posts)
            })
        }
    }catch(error){
        console.log(error);
        res.send("error");
    }
}

export const search_post = async function(req, res) {
    try{
        
        const {type,subject,word,board,study_id} = req.body;
        console.log(board, type);
        let result;
        if(type === "common"){
            result = await common_post_model.search_common_post(board,subject,word)
        }else if(type === "study"){
            
            result = await study_post_model.search_study_post(study_id,board,subject, word)
        }
        res.send(result);
    }catch(error){
        console.log(error);
        
        res.send("error");
    }
}
export const file_upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, process.env.FILE_PATH);
        }, 
        filename: function(req, file, cb) {
            cb(null , new Date().valueOf() + path.extname(file.originalname));
        }
    })
});