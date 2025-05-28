const mongoose = require("mongoose");
const baseUserSchema = require("./baseUserModel");

const patientSchema = new mongoose.Schema();

//  Inherit properties and methods from `baseUserSchema`
//and add addional properties
patientSchema.add(baseUserSchema).add({
  role: {
    type: String,
    enum: ["patient"],
    default: "patient",
  },
  appointments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  age: {
    type: Number,
    required: [true, "Please provide age"],
  },
  bloodGroup: {
    type: String,
    maxlength: [3, "Blood group can not exceed more than 3 characters"],
  },
});

module.exports = mongoose.model("Patient", patientSchema);
