const wishlist = require('../models/wishlistModel')

//add to wishlist

exports.addToWishlistController = async (req, res) => {
    const { userId } = req.params
    console.log(userId);
    const { _id, title, image, varient, description, price } = req.body
    console.log(_id, title, image, varient, description, price);
    try {
        const wishlistItems = await wishlist.findOne({ productid: _id, userId })
        if (wishlistItems) {
            res.status(400).json({
                message: 'product already in wishlist'
            })
        }
        else {
            await wishlist.create({
                productid: _id, title, image, varient, description, price, userId
            })
            res.status(200).json({
                message: "Added to wishlist successfully"
            })
        }

    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

//get wishlist

exports.getWishlistController = async (req, res) => {
    const { userId } = req.params
    try {
        const userWishlist = await wishlist.find({ userId })
        res.status(200).json({
            message: "Wishlist retrieved successfully",
            wishlist: userWishlist
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

//delete from wishlist
exports.deleteFromWishlistController = async (req, res) => {
    const { id } = req.params
    const { userId } = req.body
    console.log(id);

    try {
        await wishlist.deleteOne({ productid: id, userId })
        res.status(200).json({
            message: "Item deleted from wishlist successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}