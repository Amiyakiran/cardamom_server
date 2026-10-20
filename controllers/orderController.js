const orders = require("../models/orderModel");


//add Orders


exports.addOrdersController = async (req, res) => {
    const { name, email, address, products, amount } = req.body
    console.log(name, email, address, products, amount);
    try {
        const newOrder = await orders.create({
            orderId: "OID" + Math.floor(100000 + Math.random() * 900000),
            name,
            email,
            address,
            products,
            TotalAmount: amount
        })
        res.status(200).json({
            "message": "Order successfully Placed",
            "order": newOrder

        })

    } catch (error) {
        res.status(500).json({
            "message": "Internal server error"
        })
    }

}

//get all order 


//get all orders of a user
