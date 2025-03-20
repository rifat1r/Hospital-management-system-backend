const express = require("express");
const {
  patientRegister,
  patientLogin,
  updateProfile,
  getPatientProfile,
  patientLogout,
} = require("../controllers/patientController");
const {
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(patientRegister);

router.route("/login").post(patientLogin);

router
  .route("/logout")
  .get(isAuthenticated, authorizeRoles("patient"), patientLogout);

router
  .route("/profile/update")
  .patch(isAuthenticated, authorizeRoles("patient"), updateProfile);

//get doctor profile
router
  .route("/profile")
  .get(isAuthenticated, authorizeRoles("patient"), getPatientProfile);

// update password
router
  .route("/password/update")
  .patch(isAuthenticated, authorizeRoles("patient"), updatePassword);

//password forgot
router.route("/password/forgot").post(forgotPassword);

//reset password
router.route("/password/reset/:token").post(resetPassword);

module.exports = router;
