const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================
// PUBLIC ROUTES
// ==========================

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// ==========================
// PROTECTED ROUTES
// ==========================

// Get currently logged-in user's profile
router.get("/profile", protect, getProfile);

module.exports = router;