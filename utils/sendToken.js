const sendToken = (res, user, statusCode) => {
  const token = user.generateToken();
  res.cookie("token", token, {
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
  });
  res.status(statusCode).json({
    success: true,
    user,
  });
};

module.exports = sendToken;
