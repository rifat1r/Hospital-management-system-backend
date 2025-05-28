const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
  CustomAPIError,
} = require("../errors");
const asyncWrapper = require("../middleware/asyncWrapper");
const sendToken = require("../utils/sendToken");
const blackListedToken = require("../models/blackListedToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const getUserModel = require("../utils/getUserModel");
const identifyTargetUser = require("../utils/identifyTargetUser");

// register all types of users
exports.register = asyncWrapper(async (req, res, next) => {
  const role = req.body.role;
  const User = getUserModel(role);

  if (role === "admin" || role === "doctor") {
    //we only have createdBy field for admin and doctor
    req.body.createdBy = req.user.userId;
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    throw new UnauthenticatedError(
      `${user.role} already exist with ${user.email}`
    );
  }

  //hash the password using static method
  const hashedPassword = await User.hashPassword(req.body.password);
  req.body.password = hashedPassword;

  user = new User({ ...req.body });
  await user.save();

  // we dont send the token for doctor and admin register
  if (role === "admin" || role === "doctor") {
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: `${role} created successfully`,
    });
  } else {
    sendToken(res, user, StatusCodes.CREATED);
  }
});

exports.login = asyncWrapper(async (req, res, next) => {
  const User = getUserModel(req.body.role);

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("please provide fill up all the fields"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new UnauthenticatedError("Invalid email or password"));
  }

  const isPasswordmatched = await user.comparePassword(password);
  if (!isPasswordmatched) {
    return next(new UnauthenticatedError("Invalid email or password"));
  }
  sendToken(res, user, StatusCodes.OK);
});

exports.logout = asyncWrapper(async (req, res, next) => {
  const token = req.cookies?.token;
  //black list the token
  await blackListedToken.create({ token });
  res.clearCookie("token");
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Logout successful!",
  });
});

//update password
exports.updatePassword = asyncWrapper(async (req, res, next) => {
  const {
    body: { password, newPassword, confirmPassword },
  } = req;

  const User = getUserModel(req.user.role);

  let user = await User.findById(req.user.userId).select("+password");
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
  const hashedPassword = await User.hashPassword(newPassword);
  user.password = hashedPassword;

  await user.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Password updated successfully",
  });
});

//forgot password
/*takes role and email from req.body*/
exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  const User = getUserModel(req.body.role);

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new NotFoundError(`User not found with ${req.body.email}`);
  }
  const resetToken = user.generatePasswordResetToken();
  //save reset token to the user document
  await user.save({ validateBeforeSave: false });
  const message =
    `You requested a password reset. \n\n` +
    `Please click on the link below to reset your password: \n\n` +
    `http://localhost:5173/password-reset/${resetToken}` +
    `\n\n If you did not request this, please ignore this email.`;
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
    throw new CustomAPIError(error.message);
  }
});

/*takes role,newPassword,confirmPassword from req.body*/
exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const User = getUserModel(req.body.role);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new UnauthenticatedError("the token is invalid or expired");
  }
  //set new password
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    throw new BadRequestError("Password does not match");
  }
  //hash password
  const hashedPassword = await User.hashPassword(newPassword);
  user.password = hashedPassword;

  // TODO:  create sendToken module
  await user.save({ validateBeforeSave: false });

  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Password reset complete",
  });
});

// get user profile
exports.getProfile = asyncWrapper(async (req, res, next) => {
  const { userId, Model } = identifyTargetUser(req);

  const user = await Model.findById(userId);
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
});

// delete user profile
exports.deleteProfile = asyncWrapper(async (req, res, next) => {
  const { userId, Model, userRole } = identifyTargetUser(req);

  //finally delete the user
  const user = await Model.findByIdAndDelete(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    // custom message for admin and user
    msg: `${
      userId === req.user.userId ? "Your" : `The ${userRole}'s`
    } profile was deleted successfully`,
  });
});

//update user profile
exports.updateProfile = asyncWrapper(async (req, res, next) => {
  const { userId, Model, userRole } = identifyTargetUser(req);

  const userInfo = req.body;

  // we dont allow anyone to update password here
  if (userInfo.password) {
    throw new UnauthenticatedError(
      "You are not allowed to update password here"
    );
  }
  // TODO: check email is already in use
  const isExistingEmail = await Model.findOne({
    email: userInfo.email,
    _id: { $ne: userId },
  });

  // console.log("IsExisting", userInfo.email, isExistingEmail);

  if (isExistingEmail) {
    throw new BadRequestError("Email already in use");
  }

  const user = await Model.findByIdAndUpdate(userId, userInfo, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    msg: `${
      userId === req.user.userId ? "Your" : `The ${userRole}'s`
    } profile was updated successfully`,
  });
});
