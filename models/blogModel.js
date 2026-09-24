const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
         type:String,
        required:true
    },
    status:{
         type:String,
        required:true
    },
    shortDescription:{
         type:String,
        required:true
    },
    longDescription:{
         type:String,
        required:true
    },
    author:{
         type:String,
        required:true
    },
    tags:{
         type:String,
        required:true
    },
    seoTitle:{
         type:String,
        required:true
    },
    publishDate:{
        type:String,
        required:true 
    }
})

const blogs = mongoose.model("blogs", blogSchema)
module.exports = blogs