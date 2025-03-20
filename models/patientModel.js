const mongoose = require("mongoose");
const UserSchemaMethods = require("../utils/userSchemaMethods");

const patientSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["patient"],
      default: "patient",
    },
    appointments: [
      {
        appointmentId: {
          type: mongoose.Types.ObjectId,
          ref: "Appoinment",
        },
      },
    ],
    phoneNo: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    // cloudinary
    profilePicture: String,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  {
    timestamps: true,
  }
);

//reference to all the methods from userMethod
patientSchema.methods.generateToken = UserSchemaMethods.generateToken;
patientSchema.methods.comparePassword = UserSchemaMethods.comparePassword;
patientSchema.methods.generatePasswordResetToken =
  UserSchemaMethods.generatePasswordResetToken;
patientSchema.statics.hashPassword = UserSchemaMethods.hashPassword;

module.exports = mongoose.model("Patient", patientSchema);
