const Account = require("../models/Account");

// CREATE ACCOUNT
const createAccount = async (req, res) => {
  try {
    const { name, type, balance } = req.body;

    // Check required fields
    if (!name || !type) {
      return res.status(400).json({
        message: "Name and account type are required.",
      });
    }

    // Create account
    const account = await Account.create({
      name,
      type,
      balance: balance || 0,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating account",
      error: error.message,
    });
  }
};

// GET ALL ACCOUNTS OF LOGGED-IN USER
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({
      user: req.user.id,
    });

    res.status(200).json({
      accounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching accounts",
      error: error.message,
    });
  }
};

module.exports = {
  createAccount,
  getAccounts,
};