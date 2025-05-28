const { BadRequestError } = require("../errors");
const Admin = require("../models/adminModel");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");

const roleModelMap = {
  admin: Admin,
  doctor: Doctor,
  patient: Patient,
};

//selects the model based on the role
const getUserModel = (role) => {
  const User = roleModelMap[role];
  if (!User) {
    throw new BadRequestError("Invalid role");
  }
  return User;
};
module.exports = getUserModel;
