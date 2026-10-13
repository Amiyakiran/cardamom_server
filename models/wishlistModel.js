const mongoose = require('mongoose')


const wishlistSchema = new mongoose.Schema({
    productid:{
        type:String,
        required:true
    },
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
    price:{
         type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
})

const wishlist = mongoose.model("wishlist", wishlistSchema)
module.exports = wishlist