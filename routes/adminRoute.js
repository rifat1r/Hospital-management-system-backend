const express = require("express");
const {
  adminRegister,
  adminLogin,
  adminLogout,
  updateProfile,
  getAdminProfile,
} = require("../controllers/adminController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const {
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

const router = express.Router();

router
  .route("/register")
  .post(isAuthenticated, authorizeRoles("admin"), adminRegister);

router.route("/login").post(adminLogin);

//logout and blacklist the token
router
  .route("/logout")
  .get(isAuthenticated, authorizeRoles("admin"), adminLogout);

//update profile
router
  .route("/profile/update")
  .patch(isAuthenticated, authorizeRoles("admin"), updateProfile);

//get admin profile
router
  .route("/profile")
  .get(isAuthenticated, authorizeRoles("admin"), getAdminProfile);

// update password
router
  .route("/password/update")
  .patch(isAuthenticated, authorizeRoles("admin"), updatePassword);

//password forgot
router.route("/password/forgot").post(forgotPassword);

//reset password
router.route("/password/reset/:token").post(resetPassword);

module.exports = router;
