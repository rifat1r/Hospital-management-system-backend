const express = require("express");
const {
  authInRegister,
  isAuthenticated,
  authorizeRoles,
  authForRegister,
} = require("../middleware/auth");
const {
  register,
  login,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  getProfile,
  deleteProfile,
} = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(authForRegister, register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/password/update").patch(isAuthenticated, updatePassword);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").post(resetPassword);

router.route("/profile/update").patch(isAuthenticated, updateProfile);

router.route("/profile/delete").delete(isAuthenticated, deleteProfile);

//get doctor profile
router.route("/profile").get(isAuthenticated, getProfile);

module.exports = router;
