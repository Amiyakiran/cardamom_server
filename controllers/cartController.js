const cartModel = require('../models/cartModel')

//add to cart
exports.addToCartController = async (req, res) => {
    const { userId } = req.params
    const { _id, title, image, varient, description, price } = req.body

    console.log(userId, _id, title, image, varient, description, price);
    try {
        const existingproduct = await cartModel.findOne({ productid: _id, userId })
        if (existingproduct) {
            res.status(400).json({
                message: 'Product already in your cart'
            })
        }
        else {
            await cartModel.create({
                productid: _id, title, image, varient, description, price, userId,
                total: price
            })
            res.status(200).json({
                message: "Added to cart successfully"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }

}

//get all cart product
exports.getAllCartProductController = async (req, res) => {
    const { userId } = req.params
    console.log(userId);

    try {

        const allProduct = await cartModel.find({ userId })
        console.log(allProduct);
        if (allProduct) {
            res.status(200).json({ allcartProduct: allProduct })
        }
        else {
            res.status(400).json({
                "message": "No product in wishlist"
            })
        }


    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

//delete from cart
exports.deleteFromCartController = async (req, res) => {
    const { id } = req.params
    const { userId } = req.body
    try {
        await cartModel.deleteOne({ productid: id, userId })
        res.status(200).json({
            message: 'deleted Successfully'
        })

    } catch (error) {
        res.status(500).json({
            "message": "Internal server error"
        })
    }
}

//increment quantity
exports.increamentCountController = async (req, res) => {
    const { id } = req.params
    const { userId } = req.body
    try {
        const product = await cartModel.findOne({ productid: id, userId })
        const newCount = product.count + 1
        const newtotal = (product.quantity / 1000) * product.price * newCount
        await cartModel.updateOne({ productid: id, userId }, { $set: { count: newCount, total: newtotal } })
        res.status(200).json({
            "message": "Updated Successfully",
        })


    } catch (error) {
        res.status(500).json({
            "message": "Internal server error"
        })
    }
}

exports.decrementProductCountController = async (req, res) => {
    const { id } = req.params
    const { userId } = req.body
    try {

        const product = await cartModel.findOne({ productid: id, userId })

        if (product.count <= 1) {
            await cartModel.deleteOne({ productid: id, userId })
            res.status(200).json({
                "message": "removed Successfully",
            })
        }
        else {
            const newCount = product.count - 1
            const newtotal = (product.quantity / 1000) * product.price * newCount
            await cartModel.updateOne({ productid: id, userId }, { $set: { count: newCount, total: newtotal } })
            res.status(200).json({
                "message": "deceremented Successfully",
            })
        }




    } catch (error) {
        res.status(500).json({
            "message": "Internal server error"
        })
    }
}

//update quantity
exports.updateQuantityController = async (req, res) => {
    const { id } = req.params
    const { userId, quantity } = req.body
    try {

        const product = await cartModel.findOne({ productid: id, userId })
        const newtotal = (quantity / 1000) * product.price * product.count


        await cartModel.updateOne({ productid: id, userId }, { $set: { quantity, total: newtotal } })
        res.status(200).json({
            "message": "Updated Successfully",
            
        })

    } catch (error) {
        res.status(500).json({
            "message": "Internal server error"
        })
    }
}