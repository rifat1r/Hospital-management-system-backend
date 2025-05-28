const sendToken = (res, user, statusCode) => {
  const token = user.generateToken();
  // custom meesage
  const msg = `${user.role} ${
    statusCode === 201 ? "created" : "logged in"
  } successfully!`;
  res.cookie("token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
  });
  res.status(statusCode).json({
    success: true,
    msg,
  });
};

module.exports = sendToken;
