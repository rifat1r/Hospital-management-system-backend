const Admin = require("../models/adminModel");
const blackListedToken = require("../models/blackListedToken");
const UserMethods = require("../utils/userMethods");

//register an admin
exports.adminRegister = UserMethods.register(Admin);

//admin login
exports.adminLogin = UserMethods.login(Admin);

//logout admin and black list the token
exports.adminLogout = UserMethods.logout(blackListedToken);

//update admin profile
exports.updateProfile = UserMethods.updateProfile(Admin);

// get admin profile
exports.getAdminProfile = UserMethods.getProfile(Admin);
