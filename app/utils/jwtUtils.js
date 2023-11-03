const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env");

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = { generateToken, verifyToken };
