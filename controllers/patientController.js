const blackListedToken = require("../models/blackListedToken");
const Patient = require("../models/patientModel");
const UserMethods = require("../utils/userMethods");

//patient register
exports.patientRegister = UserMethods.register(Patient);

//patient login
exports.patientLogin = UserMethods.login(Patient);

//logout patient and black list the token
exports.patientLogout = UserMethods.logout(blackListedToken);

//update patient profile
exports.updateProfile = UserMethods.updateProfile(Patient);

// get patient profile
exports.getPatientProfile = UserMethods.getProfile(Patient);
