const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================

const protect = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Token missing.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user from token
    const user = await User.findById(
      decoded.id
    ).select("-password");

    // Check if user still exists
    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to next controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token.",
    });
  }
};

module.exports = protect;