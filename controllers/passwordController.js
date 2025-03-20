const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middleware/asyncWrapper");
const {
  UnauthenticatedError,
  NotFoundError,
  CustomAPIError,
  BadRequestError,
} = require("../errors");
const Admin = require("../models/adminModel");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.updatePassword = asyncWrapper(async (req, res, next) => {
  const {
    body: { password, newPassword, confirmPassword },
  } = req;
  let model;

  //select the user model depending on user.role
  if (req.user.role === "admin") {
    model = Admin;
  } else if (req.user.role === "doctor") {
    model = Doctor;
  } else if (req.user.role === "patient") {
    model = Patient;
  } else {
    return next(new UnauthenticatedError("Invalid user role"));
  }
  let user = await model.findById(req.user.userId).select("+password");
  if (!user) {
    return next(new NotFoundError("User not found"));
  }
  //   console.log(user instanceof Admin);
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new UnauthenticatedError("The old password does not match"));
  }
  if (newPassword !== confirmPassword) {
    return next(new UnauthenticatedError("Password does not match"));
  }
  //hash password
  const hashedPassword = await Admin.hashPassword(newPassword);
  user.password = hashedPassword;

  await user.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Password updated successfully",
  });
});

/*take role and email from req.body*/
exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  let model;

  //select the user model depending on user role
  if (req.body.role === "admin") {
    model = Admin;
  } else if (req.body.role === "doctor") {
    model = Doctor;
  } else if (req.body.role === "patient") {
    model = Patient;
  } else {
    return next(new UnauthenticatedError("Invalid user role"));
  }
  const user = await model.findOne({ email: req.body.email });
  if (!user) {
    return next(new NotFoundError("User not found"));
  }
  const resetToken = user.generatePasswordResetToken();
  //save reset token to the user document
  await user.save({ validateBeforeSave: false });
  const message = `Your password reset token is \n\n ${
    req.protocol
  }://${req.get("host")}/api/auth/${
    user.role
  }/password/reset/${resetToken} \n\n . if you did not request for this email please ignore it. `;
  const subject = "Hospital password recovery";
  try {
    await sendEmail({
      user: user.email,
      subject,
      message,
    });
    res.status(StatusCodes.OK).json({
      msg: `Password recovery email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomAPIError(error.message));
  }
});

/*takes role,newPassword,confirmPassword from req.body*/
exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const token = req.params.token;
  console.log(token);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //select the user model depending on user role
  let model;
  if (req.body.role === "admin") {
    model = Admin;
  } else if (req.body.role === "doctor") {
    model = Doctor;
  } else if (req.body.role === "patient") {
    model = Patient;
  } else {
    return next(new UnauthenticatedError("Invalid user role"));
  }
  console.log(hashedToken);
  const user = await model.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new UnauthenticatedError("the token is invalid or expired"));
  }
  //set new password
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return next(new BadRequestError("Password does not match"));
  }
  //hash password
  const hashedPassword = await Admin.hashPassword(newPassword);
  user.password = hashedPassword;

  // TODO:  create sendToken module
  await user.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({
    msg: "Password reset complete",
  });
});
