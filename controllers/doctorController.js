const Doctor = require("../models/doctorModel");
const blackListedToken = require("../models/blackListedToken");
const UserMethods = require("../utils/userMethods");

//registers doctor (admin)
exports.doctorRegister = UserMethods.register(Doctor);

//login doctor
exports.doctorLogin = UserMethods.login(Doctor);

//logout doctor and black list the token
exports.doctorLogout = UserMethods.logout(blackListedToken);

//update doctor profile
exports.updateProfile = UserMethods.updateProfile(Doctor);

// get doctor profile
exports.getDoctorProfile = UserMethods.getProfile(Doctor);
