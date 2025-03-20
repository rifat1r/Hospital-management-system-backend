const express = require("express");
const {
  doctorRegister,
  doctorLogin,
  doctorLogout,
  updateProfile,
  getDoctorProfile,
} = require("../controllers/doctorController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const {
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

const router = express.Router();

//only admin can register a doctor
router
  .route("/register")
  .post(isAuthenticated, authorizeRoles("admin"), doctorRegister);

router.route("/login").post(doctorLogin);

router.route("/logout").get(isAuthenticated, doctorLogout);

router
  .route("/profile/update")
  .patch(isAuthenticated, authorizeRoles("doctor"), updateProfile);

//get doctor profile
router
  .route("/profile")
  .get(isAuthenticated, authorizeRoles("doctor"), getDoctorProfile);

// update password
router
  .route("/password/update")
  .patch(isAuthenticated, authorizeRoles("doctor"), updatePassword);

//password forgot
router.route("/password/forgot").post(forgotPassword);

//reset password
router.route("/password/reset/:token").post(resetPassword);

module.exports = router;
