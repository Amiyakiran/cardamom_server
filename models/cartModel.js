const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
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
    quantity:{
            type:Number,
    },
    count:{
        type:Number,
    },
    userId:{
        type:String,
        required:true
    }
})

const cart = mongoose.model("cart", cartSchema)
module.exports = cart