const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false //This means Mongoose won't normally return the password field when you query a user.(if i use findOne() method to find a user, the password field will not be included in the returned document by default.)
    },
    resetPasswordToken:{
      type:String
    },
    resetPasswordExpires:{
      type:Date
    }
  },
  {
    timestamps: true
  }
)

const users = mongoose.model("users", userSchema)

module.exports = users