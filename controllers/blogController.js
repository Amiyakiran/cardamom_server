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