// checks wheter the user is authenticated
const { UnauthenticatedError } = require("../errors");
const asyncWrapper = require("../middleware/asyncWrapper");
const jwt = require("jsonwebtoken");
const blackListedToken = require("../models/blackListedToken");

exports.isAuthenticated = asyncWrapper(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new UnauthenticatedError("Please login to access this resource");
  }
  // check whether the token is blacklisted
  const isBlackListed = await blackListedToken.findOne({ token });
  if (isBlackListed) {
    throw new UnauthenticatedError("Unauthorized access");
  }

  const decoded = jwt.verify(token, "secret");
  //   TODO: get the whole user object by  the id from different models and set it with req.user

  req.user = decoded; //userId ,role
  next();
});

exports.authorizeRoles = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Unauthorized Access");
    }
    return next();
  };
};

exports.authForRegister = asyncWrapper(async (req, res, next) => {
  //only admin can register doctor and admin
  const role = req.body.role;
  const token = req.cookies?.token;
  if (["admin", "doctor"].includes(role)) {
    if (!token) {
      throw new UnauthenticatedError("Unauthorized access");
    }
    const decoded = jwt.verify(token, "secret");
    req.user = decoded; //userId,role
    if (decoded?.role !== "admin") {
      throw new UnauthenticatedError("Unauthorized access");
    }
    return next();
  } else {
    next();
  }
});
