const express = require("express");

const {
  createAccount,
  getAccounts,
} = require("../controllers/accountController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE ACCOUNT
router.post("/", authMiddleware, createAccount);

// GET ALL ACCOUNTS
router.get("/", authMiddleware, getAccounts);

module.exports = router;