const mongoose = require("mongoose");
const baseUserSchema = require("./baseUserModel");

const adminSchema = new mongoose.Schema();

//  Inherit properties and methods from `baseUserSchema`
//and add addional properties
adminSchema.add(baseUserSchema).add({
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
});

module.exports = mongoose.model("Admin", adminSchema);
