// checks wheter the user is authenticated
const { UnauthenticatedError } = require("../errors");
const asyncWrapper = require("../middleware/asyncWrapper");
const jwt = require("jsonwebtoken");
const blackListedToken = require("../models/blackListedToken");

exports.isAuthenticated = asyncWrapper(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return next(
      new UnauthenticatedError("Please login to access this resource")
    );
  }
  // check whether the token is blacklisted
  const isBlackListed = await blackListedToken.findOne({ token });
  if (isBlackListed) {
    return next(new UnauthenticatedError("Unauthorized access"));
  }

  const decoded = jwt.verify(token, "secret");
  //   TODO: get the whole user object by  the id from different models and set it with req.user

  req.user = decoded; //userId ,role
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new UnauthenticatedError(
          `Role: ${req.user.role} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
