const mongoose = require("mongoose");
const UserSchemaMethods = require("../utils/userSchemaMethods");

const doctorSchema = new mongoose.Schema({
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
    enum: ["doctor"],
    default: "doctor",
    required: true,
  },
  designation: {
    type: String,
    required: true,
    maxLength: [20, "Designation can not exceed more than 20 characters"],
  },
  passingYear: {
    type: Number,
    required: [true, "Passing year is required"],
  },

  appointments: [
    {
      appointmentId: {
        type: mongoose.Types.ObjectId,
        ref: "Appoinments",
      },
    },
  ],
  services: [
    {
      serviceId: {
        type: mongoose.Types.ObjectId,
        ref: "Services",
      },
    },
  ],

  // cloudinary
  profilePicture: String,
  phoneNo: Number,
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
});

//reference to all the methods from userMethod
doctorSchema.methods.generateToken = UserSchemaMethods.generateToken;
doctorSchema.methods.comparePassword = UserSchemaMethods.comparePassword;
doctorSchema.methods.generatePasswordResetToken =
  UserSchemaMethods.generatePasswordResetToken;
doctorSchema.statics.hashPassword = UserSchemaMethods.hashPassword;

module.exports = mongoose.model("Doctor", doctorSchema);
