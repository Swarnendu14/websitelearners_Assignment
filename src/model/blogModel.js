const mongoose = require("mongoose") //importing mongoose 

const blogSchema = new mongoose.Schema({ //creting a Schema for blog model
    title:{
        type: String,
        required:true
        
    },

    body:{
        type:String,
        required:true
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true     
    },

    publishedAt:{
        type:Date,
        default:null
    },

    isDeleted:{
        type:Boolean,
        default:false    
    }
    
       
},{timestamps:true})

module.exports = mongoose.model("blog",blogSchema)  //exporting blog model



