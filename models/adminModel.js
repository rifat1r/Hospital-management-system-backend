const mongoose = require("mongoose");
const UserSchemaMethods = require("../utils/userSchemaMethods");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minLength: [3, "Name should be atleast 3 characters"],
      maxLength: [30, "Name can not exceed more than 30 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      minLength: [3, "email should be atleast 3 characters"],
      maxLength: [30, "email can not exceed more than 30 characters"],
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: [6, "Password should be atleast 6 characters"],
      select: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    // cloudinary
    profilePicture: String,
    phoneNo: Number,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  {
    timestamps: true,
  }
);

//reference to all the methods from userMethod
adminSchema.methods.generateToken = UserSchemaMethods.generateToken;
adminSchema.methods.comparePassword = UserSchemaMethods.comparePassword;
adminSchema.methods.generatePasswordResetToken =
  UserSchemaMethods.generatePasswordResetToken;
adminSchema.statics.hashPassword = UserSchemaMethods.hashPassword;

module.exports = mongoose.model("Admin", adminSchema);
