const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    varient:{
         type:String,
        required:true
    },
  
    description:{
         type:String,
        required:true
    },
    stock:{
         type:Number,
        required:true
    },
    price:{
         type:Number,
        required:true
    },
    date:{
         type:String,
        required:true
    }
})

const products = mongoose.model("products", productSchema)
module.exports = products