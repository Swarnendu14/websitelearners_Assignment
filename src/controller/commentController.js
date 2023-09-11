const commentModel = require("../model/commentModel");
const blogModel = require("../model/blogModel");


const moment = require("moment");
let dateAndTime = moment().format('LLLL');

const createComment = async(req, res) => {
   try{
    const {body,userId,blogId} = req.body;
    
    const commentData = await commentModel.create({body : body, userId: userId, blogId: blogId, commentAt : dateAndTime});
    return res.status(201).send({status: true, commentData : commentData});
   }
   catch(error){
    return res.status(500).send({status: false, msg: error.message});
   }

}

const getComments = async(req, res) => {
    try{
        const blogId = req.body.blogId;
        
        const commentData = await commentModel.find({blogId:blogId, isDeleted: false}).select({body : 1});
        const blogData = await blogModel.findOne({_id: blogId, isDeleted: false}).select({body : 1});
        return res.status(200).send({status: true, blogBody: blogData, commentData : commentData});
       }
       catch(error){
        return res.status(500).send({status: false, msg: error.message});
       }
      
}

const updateComments = async(req, res) => {
   try{
     const {body,commentId} = req.body;
    const userId = req.params.userId;
    const commentData = await commentModel.findOne({_id: commentId, isDeleted: false});
    if(commentData.userId != userId)
    return res.status(400).send({status: true, msg: "User is not authorized to update"});
    const updateComment = await commentModel.findByIdAndUpdate(commentId, {$set:{body : body, commentAt: dateAndTime}}, {new: true});
    return res.status(200).send({status: true, msg:"comment updated successfully", updateComment: updateComment});
    }
   catch(error){
    return res.status(500).send({status: false, msg: error.message});
   }
}

const deleteComments = async(req, res) => {

    try{
        const commentId = req.body.commentId;
       const userId = req.params.userId;
       const commentData = await commentModel.findOne({_id: commentId, isDeleted: false});
       if(commentData.userId != userId)
       return res.status(400).send({status: true, msg: "User is not authorized to delete"});
       const deleteComment = await commentModel.findByIdAndUpdate(commentId, {$set:{isDeleted: true}}, {new: true});
       return res.status(200).send({status: true, msg:"comment deleted successfully"});
       }
      catch(error){
       return res.status(500).send({status: false, msg: error.message});
      }
   }
    



module.exports.createComment = createComment;
module.exports.getComments = getComments;
module.exports.updateComments = updateComments;
module.exports.deleteComments = deleteComments;