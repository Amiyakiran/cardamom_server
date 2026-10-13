const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    productid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    varient: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1000
    },
    count: {
        type: Number,
        default: 1
    },
    total:{
        type:Number,
        default:0
    },
    userId: {
        type: String,
        required: true
    }
})

const cart = mongoose.model("cart", cartSchema)
module.exports = cart