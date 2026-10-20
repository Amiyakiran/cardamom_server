const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    TotalAmount: {
        type: Number,
        required: true
    },
    status:{
        type:Object,
        default:"Placed"
    }

},
    {
        timestamps: true
    })


const orders = mongoose.model("orders", orderSchema)

module.exports = orders    