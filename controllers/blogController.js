const blogs = require('../models/blogModel')



//create blog

exports.createBlogController = async (req, res) => {
    console.log('inside ceateblog controller')
    try {
        const { title, category, status, shortDescription, longDescription, author, tags, seoTitle, publishDate } = req.body

        const image = req.file.filename

        if (!title || !image || !category || !status || !shortDescription || !longDescription || !author || !tags || !seoTitle || !publishDate) {
            res.status(401).json({
                message: "Fill all the fields completely"
            })
        }
        else {
            const newBlog = await blogs.create({
               title, image, category, status, shortDescription, longDescription, author, tags, seoTitle, publishDate
            })
           res.status(200).json({
            message:"New Blog Added Successfully"
           })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

//get all blog
exports.getAllBlogController = async(req, res)=>{
    try {
        
        const allBlog = await blogs.find()
        res.status(200).json(allBlog)

    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

//get a particular blog

exports.getABlogController = async(req, res)=>{
     const {id} = req.params

    try {

        const blog = await blogs.findOne({_id:id})
        res.status(200).json(blog)
        
    } catch (error) {
         res.status(500).json({
            message:"Internal server error"
        })
    }
}

//delete a particular blog

exports.deleteBlogController = async(req, res)=>{
    const {id} = req.params
    try {
        await blogs.findByIdAndDelete({_id:id})
        res.status(200).json({
            message:"successfully deleted"
        })
        
    } catch (error) {
       res.status(500).json({
            message:"Internal server error"
        })  
    }
}


//edit a blog 
exports.editBlogController = async(req, res)=>{

    try {
         const {id} = req.params
         console.log(id);
        const { title, category, status, shortDescription, longDescription, author, tags, seoTitle, publishDate} = req.body
       
         const existingBlog = await blogs.findOne({ _id: id })
        if (existingBlog) {
            const image = req.file?.filename || existingBlog.image
            const updatedBlog = await blogs.findByIdAndUpdate({ _id: id }, {
                title, image, category, status, shortDescription, longDescription, author, tags, seoTitle, publishDate
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
            message:"Internal server error"
        })  
    }
}