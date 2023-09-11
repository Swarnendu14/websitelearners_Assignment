const mongoose = require("mongoose") //importing mongoose 

const commentSchema = new mongoose.Schema({ //creating a Schema for comment model
   

    body:{
        type:[String],
        required:true
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true     
    },

    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog",
        required:true     
    },


    commentAt:{
        type:Date,
        default:null
    },

    isDeleted:{
        type:Boolean,
        default:false    
    }
    
       
},{timestamps:true})

module.exports = mongoose.model("comment",commentSchema)  //exporting comment model



