const routes = require('express').Router();
const userController = require('./controllers/userController')
const messageController = require('./controllers/messageController');
const multerConfig = require('./middleware.js/multerMiddleware');
const blogController = require('./controllers/blogController')

//common request

//register
routes.post('/register',userController.registerController)
//login
routes.post('/login',userController.loginController)
//google login

routes.post('/google_login',userController.googleLoginController)

//to get the user logged in
routes.get('/me',userController.getMeController)

//logout
routes.post('/logout',userController.logoutController)

//forgot password
routes.post('/forgot_password', userController.forgotPasswordController)

//-----------------------------------------------------------------
//customer

//send mail
routes.post('/sendmessage', messageController.sendMessageController)


//------------------------------------------------------------------
//admin

//add blog
routes.post('/add-blog',multerConfig.single('image'), blogController.createBlogController)


module.exports = routes;