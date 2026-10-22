const mongoose = require("mongoose")

const inventoryProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    title: String,
    image: String,
    varient: String,
    openingStock: {
        type: Number,
        required: true,
        min: 0
    },
    unitsSold: {
        type: Number,
        required: true,
        min: 0
    },
    stockAdded: {
        type: Number,
        required: true,
        min: 0
    },
    closingStock: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false })

const inventorySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: [inventoryProductSchema],
        required: true,
        validate: (products) => products.length > 0
    }
})

const Inventories = mongoose.model("Inventories", inventorySchema)

module.exports = Inventories