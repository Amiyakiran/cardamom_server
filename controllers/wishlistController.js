const wishlist = require('../models/wishlistModel')

//add to wishlist

exports.addToWishlistController = async (req, res) => {
    const { userId } = req.params
    console.log(userId);
    const { title, image, varient, description, price } = req.body
    console.log(title, image, varient, description, price);
    try {
         await wishlist.create({
            title, image, varient, description, price, userId
        })
        res.status(200).json({
            message: "Added to wishlist successfully"
        })
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
    try {
        await wishlist.findByIdAndDelete(id)
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