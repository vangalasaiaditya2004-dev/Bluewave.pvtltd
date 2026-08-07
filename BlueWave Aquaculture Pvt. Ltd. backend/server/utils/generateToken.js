// This utility creates a JWT token after successful login.

const jwt = require("jsonwebtoken");

function generateToken(user) {
  // Store only safe user details in the token. Never store the password.
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

module.exports = generateToken;
