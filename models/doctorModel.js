const mongoose = require("mongoose");
const baseUserSchema = require("./baseUserModel");

const doctorSchema = new mongoose.Schema();

//  Inherit properties and methods from `baseUserSchema`
//and add addional properties
doctorSchema.add(baseUserSchema).add({
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
      type: mongoose.Types.ObjectId,
      ref: "Appoinments",
    },
  ],
  services: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Services",
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
