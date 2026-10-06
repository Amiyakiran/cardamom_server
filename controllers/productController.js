const messages = require("../models/messageModel");
const products = require("../models/productModel");





//add product

exports.addProductController = async (req, res) => {
    const { title, varient, description, stock, price, date } = req.body
    const image = req.file.filename
    console.log(title, varient, description, stock, price, date, image);

    try {
        const newProduct = await products.create({
            title, date, image, varient, description, stock, price,
        })

        res.status(200).json({
            message: "Product added successfully"
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

//get all products

exports.getAllProductsController = async (req, res) => {
    const { search } = req.query
    console.log(search);

    try {
        const query = {
            title: {
                $regex: search, $options: "i"
            }
        }

        const allproducts = await products.find(query)
        res.status(200).json(allproducts)

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

//delete  a product

exports.deleteproductController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        const prod = await products.deleteOne({ _id: id })
        res.status(200).json(prod)
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

//get a particular product
exports.getaProductController = async(req,res)=>{
    const {id} = req.params 
    try {

        const product =await products.findOne({_id:id})
        if(product){
            res.status(200).json({
                product
            })
        }
        else{
           res.status(200).json({
                message:"No such product"
            }) 
        }
        
    } catch (error) {
     res.status(500).json({
        message:"Internal server error"
     })   
    }
}


//edit PRODUCT
exports.editProductController = async (req, res) => {
    const { id } = req.params
    const { title, varient, description, stock, price, date } = req.body
    try {
        const existingProduct = await products.findOne({ _id: id })
        if (existingProduct) {
            const image = req.file?.filename || existingProduct.image
            const updatedProduct = await products.findByIdAndUpdate({ _id: id }, {
               title, date, image, varient, description, stock, price
            },{returnDocument: 'after'})

            res.status(200).json({
                message:"Product updated successfully"
            })
            
        }
        else {
            res.status(400).json({
                message: 'something went wrong'
            })
        }


    } catch (error) {
        res.status(500).json({
            message: "Internal serevr error"
        })
    }
}

//get home products
exports.getHomeProductsController = async (req, res) => {
    try{

        const productsData = await products.find().limit(3)
        res.status(200).json(productsData)

    }
    catch(error){
        res.status(500).json({
            message: "Internal server error"
        })
    }
}