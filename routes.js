const routes = require('express').Router();
const userController = require('./controllers/userController')
const messageController = require('./controllers/messageController');
const multerConfig = require('./middleware.js/multerMiddleware');
const blogController = require('./controllers/blogController')
const productController = require('./controllers/productController')
const wishlistController = require('./controllers/wishlistController')
const cartController = require('./controllers/cartController')



//---------------------------common request-----------------------

//register
routes.post('/register', userController.registerController)
//login
routes.post('/login', userController.loginController)
//google login

routes.post('/google_login', userController.googleLoginController)

//to get the user logged in
routes.get('/me', userController.getMeController)

//logout
routes.post('/logout', userController.logoutController)

//forgot password
routes.post('/forgot_password', userController.forgotPasswordController)

//resetpassword
routes.post('/reset_password/:token', userController.resetPasswordController)


//get all products
routes.get('/all_products', productController.getAllProductsController)

//get a particular product
routes.get('/a_product/:id', productController.getaProductController)

//get home products
routes.get('/home_products', productController.getHomeProductsController)



//-----------------------------------------------------------------


//-----------------------------customer-----------------------------

//send mail
routes.post('/sendmessage', messageController.sendMessageController)

//add to wishlist
routes.post('/add_to_wishlist/:userId', wishlistController.addToWishlistController)

//get wishlist
routes.get('/wishlist/:userId', wishlistController.getWishlistController)

//delete from wishlist
routes.delete('/delete_from_wishlist/:id', wishlistController.deleteFromWishlistController)

//add to cart
routes.post('/add_to_cart/:userId', cartController.addToCartController)


//get all cart Items
routes.get('/all-cart-items/:userId', cartController.getAllCartProductController)

//delete from cart
routes.delete('/delete_from_cart/:id', cartController.deleteFromCartController)


//increase the product count
routes.post('/increment-count/:id',cartController.increamentCountController)


//decrement the product count
routes.post('/decrement-count/:id',cartController.decrementProductCountController)

//update the product quantity
routes.post('/update-quantity/:id',cartController.updateQuantityController)

//update profile image
routes.post('/update-profile-image/:id',multerConfig.single('image'),userController.updateProfileImageController)




//------------------------------------------------------------------
//admin

//add blog
routes.post('/add-blog', multerConfig.single('image'), blogController.createBlogController)

//add product
routes.post('/add-products', multerConfig.single('image'), productController.addProductController)

//delete product
routes.delete('/delete_product/:id', productController.deleteproductController)

//edit product
routes.put('/edit_product/:id', multerConfig.single('image'), productController.editProductController)


//get all users
routes.get('/all_users', userController.getAllUsersController)


//delete user
routes.delete('/delete_user/:id', userController.deleteAUserController)

//create blog
routes.post('/add-blog', multerConfig.single('image'), blogController.createBlogController)

//get all blog
routes.get('/get_all_blogs', blogController.getAllBlogController)

//get a particular blog

routes.get('/get-blog/:id', blogController.getABlogController)

//edit a blog
routes.post('/edit_blog/:id', multerConfig.single('image'), blogController.editBlogController)

//delete blog 
routes.delete('/delete_blog/:id', blogController.deleteBlogController)

module.exports = routes;