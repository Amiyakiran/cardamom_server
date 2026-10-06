const users = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto") // crypto is inbuilt to node.js so no instalation is needed
// import crypto from "crypto"
const Session = require("../models/Session")
const { sendResetEmail } = require('../nodemail/resetpassword')

//register
exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      })
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase()
    console.log(normalizedEmail);


    // 3. Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      })
    }
    // 4. Check if user already exists
    const existingUser = await users.findOne({
      email: normalizedEmail
    })
    console.log(existingUser);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists"
      })
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))
    console.log(hashedPassword);

    // 6. Create user
    const user = await users.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    })

    // 7. Never send password back
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    // next(error)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

//login
exports.loginController = async (req, res) => {

  try {

    const { email, password, remember } = req.body
    console.log(email, password, remember);

    // 1. Validate input

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    // 2. Normalize email

    const normalizedEmail = email.trim().toLowerCase()

    // 3. Find user

    const user = await users.findOne({ email: normalizedEmail }).select("+password") // select=true is set in the user model for the password field, so we need to explicitly include it here.
    console.log(user);
    // Important:
    // Don't reveal whether email exists.

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    // 4. Compare password

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    // 5. Generate session ID

    const sessionId = crypto.randomBytes(32).toString("hex")
    console.log(`sessionId: ${sessionId}`);

    // 6. Decide session duration

    const maxAge = remember
      ? 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
      : undefined

    // 7. Create session

    await Session.create({
      sessionId,
      userId: user._id,

      expiresAt: remember
        ? new Date(Date.now() + maxAge)//current date + 30 days in milliseconds
        : null
    })

    // 8. Set HttpOnly cookie - no javascript code can read this cookie, only the server can access it. This is a security measure to prevent XSS attacks.

    res.cookie(
      "sessionId",
      sessionId,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",//to know the application is running inthe production face.

        sameSite: "lax",

        ...(maxAge && {
          maxAge
        })
      }
    )

    // 9. Return safe user data

    return res.status(200).json({

      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    })

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

//google login
exports.googleLoginController = async (req, res) => {
  const { name, email, password, remember } = req.body

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    let user = await users.findOne({ email: normalizedEmail })

    if (!user) {
      user = await users.create({
        name: name.trim(),
        email: normalizedEmail,
        password
      })
    }

    const sessionId = crypto.randomBytes(32).toString("hex")
    const maxAge = remember
      ? 30 * 24 * 60 * 60 * 1000
      : undefined

    await Session.create({
      sessionId,
      userId: user._id,
      expiresAt: remember
        ? new Date(Date.now() + maxAge)
        : null
    })

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(maxAge && { maxAge })
    })

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}


//authcontroller - to get the username and email of the user who is logged in. This is used to display the user's name and email on the frontend.

exports.getMeController = async (req, res) => {
  try {
    const { sessionId } = req.cookies
    console.log(sessionId);


    if (!sessionId) {
      return res.status(401).json({
        message: "Not authenticated"
      })
    }

    const session = await Session.findOne({
      sessionId,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })

    if (!session) {
      return res.status(403).json({
        message: "Session expired"
      })
    }

    const user = await users.findById(session.userId)

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

exports.logoutController = async (req, res) => {
  try {
    const { sessionId } = req.cookies

    if (sessionId) {
      await Session.deleteOne({ sessionId })
    }

    res.clearCookie("sessionId", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    })

    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Unable to log out" })
  }
}

//forgot password controller
exports.forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);



    const normalizedEmail = email.trim().toLowerCase();

    const user = await users.findOne({ email: normalizedEmail });
    console.log(user);


    /*
      Don't reveal whether the email exists. thats why 200 is set
    */

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    /*
      Generate secure random token
    */
    //crypto is nodejs builtin module to generate a secure, random password-reset token.
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(resetToken);

    // //Store token in database
    // user.resetPasswordToken = resetToken;
    //Token expires after 30 minutes
    // user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    // await user.save();
    // const resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    const updatedUser = await users.findByIdAndUpdate({ _id: user._id }, {

      resetPasswordToken: resetToken,
      resetPasswordExpires: Date.now() + 30 * 60 * 1000

    }, { returnDocument: 'after', strict: false })

    console.log(updatedUser);

    //URL sent to customer through mail

    const resetUrl = `${process.env.CLIENT_URL}` + `/reset_password/${resetToken}`;
    console.log(resetUrl);


    await sendResetEmail(email, resetUrl);

    res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    // console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}


//resetPassword
exports.resetPasswordController = async (req, res) => {
  const { token } = req.params
  const { email, password } = req.body
  console.log(email, password, token);
  try {

    const user = await users.findOne({
      resetPasswordToken: token,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    console.log(user);
    

    if (!user) {
      return res.status(400).json({
        message:
          "Password reset link is invalid or expired",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    /*
      Invalidate reset token
      */

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully",
    });


  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }

}

//get all users
exports.getAllUsersController = async(req, res)=>{
  try {
    const allUsers = await users.find()
    res.status(200).json({
    allUsers
    })
    
  } catch (error) {
    res.status(200).json({
      message:"Internal server error"
    })
  }
}

//delete a user
exports.deleteAUserController = async(req, res)=>{
  const {id} = req.params
  console.log(id);
  try {
    await users.findByIdAndDelete({_id:id})
    res.status(200).json({
      message:"deleted successfully"
    })
    
  } catch (error) {
    res.status(500).json({
      message:"Internal server error"
    })
  }
  
}