const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middleware/asyncWrapper");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const sendToken = require("../utils/sendToken");
const Admin = require("../models/adminModel");
const Doctor = require("../models/doctorModel");

class UserMethods {
  // get user profile
  getProfile(model) {
    return asyncWrapper(async (req, res, next) => {
      const user = await model.findById(req.user.userId);
      res.status(StatusCodes.OK).json({
        success: true,
        user,
      });
    });
  }
  //update user profile
  updateProfile(model) {
    return asyncWrapper(async (req, res, next) => {
      const {
        body: { name, email, phoneNo, profilePicture },
      } = req;

      const user = await model.findByIdAndUpdate(
        req.user.userId,
        {
          name,
          email,
          phoneNo,
          profilePicture,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(StatusCodes.OK).json({
        success: true,
        user,
      });
    });
  }

  //log out user
  logout(model) {
    return asyncWrapper(async (req, res, next) => {
      const token = req.cookies?.token;
      //black list the token
      await model.create({ token });
      res.clearCookie("token");
      res.status(StatusCodes.OK).json({
        success: true,
        msg: "Logout successful!",
      });
    });
  }

  //login user
  login(model) {
    return asyncWrapper(async (req, res, next) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new BadRequestError("Please provide email and password"));
      }
      const user = await model.findOne({ email }).select("+password");
      if (!user) {
        return next(new UnauthenticatedError("Invalid email or password"));
      }
      const isPasswordmatched = await user.comparePassword(password);
      if (!isPasswordmatched) {
        return next(new UnauthenticatedError("Invalid email or password"));
      }
      sendToken(res, user, StatusCodes.OK);
    });
  }

  //register admin & doctor
  register(model) {
    return asyncWrapper(async (req, res, next) => {
      //we only have createdBy field for admin and doctor
      if (model === Admin || model === Doctor) {
        req.body.createdBy = req.user.userId;
      }
      let user = await model.findOne({ email: req.body.email });
      if (user) {
        return next(
          new UnauthenticatedError(
            `${user.role} already exist with ${user.email}`
          )
        );
      }

      //hash the password using static method
      const hashedPassword = await model.hashPassword(req.body.password);
      req.body.password = hashedPassword;

      user = new model({ ...req.body });
      await user.save();

      // we dont send the token for doctor and admin register
      if (model === Admin || model === Doctor) {
        res.status(StatusCodes.CREATED).json({
          success: true,
          user,
        });
      } else {
        sendToken(res, user, StatusCodes.CREATED);
      }
    });
  }
}

module.exports = new UserMethods();
