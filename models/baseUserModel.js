const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const getUserModel = require("../utils/getUserModel");
const { BadRequestError } = require("../errors");

const baseUserSchema = new mongoose.Schema(
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
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: [6, "Password should be atleast 6 characters"],
      select: false,
    },

    // cloudinary
    profilePicture: String,
    phoneNo: Number,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  {
    methods: {
      // generates jwt token
      generateToken() {
        return jwt.sign(
          {
            userId: this._id,
            role: this.role,
          },
          "secret",
          {
            expiresIn: "5d",
          }
        );
      },
      // comapares user given password
      async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
      },

      // generates password reset token
      generatePasswordResetToken() {
        const resetToken = crypto.randomBytes(20).toString("hex");
        this.resetPasswordToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
        this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;
        return resetToken;
      },
    },
    statics: {
      // used as static method
      async hashPassword(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
      },
    },
    timestamps: true,
  }
);

module.exports = baseUserSchema;
