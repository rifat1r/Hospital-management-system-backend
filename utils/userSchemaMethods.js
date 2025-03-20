const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class UserSchemaMethods {
  // generates jwt token
  generateToken() {
    return jwt.sign(
      {
        userId: this._id,
        role: this.role,
      },
      "secret",
      {
        expiresIn: "5d",
      }
    );
  }
  // comapares user given password
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
  // generates password reset token
  generatePasswordResetToken() {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
  }

  // used as static method
  async hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}

module.exports = new UserSchemaMethods();
