const orders = require("../models/orderModel");
const users = require("../models/userModel");


//add Orders
exports.addOrdersController = async (req, res) => {
    const { name, email, address, products, amount } = req.body
    console.log(name, email, address, products, amount);
    try {
        const customer = await users.findOne({ email: String(email || "").trim().toLowerCase() })
        if (!customer) {
            return res.status(404).json({ message: "Customer account not found" })
        }
        const newOrder = await orders.create({
            orderId: "OID" + Math.floor(100000 + Math.random() * 900000),
            name,
            email,
            userId: customer._id,
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
exports.getAllOrdersController = async(req, res)=>{
    try {
        const allorders = await orders.find()
        res.status(200).json(allorders)
        
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error"
        })
    }
}


//get all orders of a user
exports.getAllUserOrdersController = async(req, res)=>{
    const {email} = req.query
    console.log(email);
    
    try {

        const alluserOrders = await orders.find({email})
        res.status(200).json(alluserOrders)
        
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error"
        })
    }
}

//get a particular order
exports.getAOrderController = async(req, res)=>{
      const {id} = req.params
    console.log(id);
    try {
        const particularOrder = await orders.findOne({_id:id})
        res.status(200).json(particularOrder)
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error"
        })
    }
}

//delete a order
exports.deleteAOrderController = async(req, res)=>{
    const {id} = req.params
    console.log(id);
    
    try {

        await orders.findByIdAndDelete({_id:id})
        res.status(200).json({
            "message":"Deleted successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error"
        })
    }
}

//update order status
exports.updateOrderStatusController = async(req, res)=>{
    const {id} = req.params 
    const {currentStatus} = req.body 
    try {
        const orderDetail = await orders.findOne({_id:id})
        if(orderDetail){
            const updatedorder = await orders.findByIdAndUpdate({_id:id},{
                orderId:orderDetail.orderId,
                name:orderDetail.name,
                email:orderDetail.email,
                address:orderDetail.address,
                products:orderDetail.products,
                TotalAmount:orderDetail.TotalAmount,
                status:currentStatus=='Placed'?'Payment Confirmed':currentStatus=='Payment Confirmed'?'Shipped':currentStatus == 'Shipped'?'Delivered':'Delivered'
            },{new:true})
            res.status(200).json({
                "message":"status Updated Successfully"
            })
        }else{
            res.status(400).json({
                "message":"No such order"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            "message":"Internal server Error"
        })
    } 
}