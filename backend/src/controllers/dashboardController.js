const Transaction = require("../models/Transaction"); 
const Account = require("../models/Account"); 
const mongoose = require("mongoose");

const getDashboard = async (req, res) => {
  try {
    // Get all user accounts
    const accounts = await Account.find({
      user: req.user.id,
    });

    // Calculate total balance
    const totalBalance = accounts.reduce((total, account) => {
      return total + account.balance;
    }, 0);

    // Get all income transactions
    const incomeTransactions = await Transaction.find({
      user: req.user.id,
      type: "income",
    });

    // Calculate total income
    const totalIncome = incomeTransactions.reduce(
      (total, transaction) => {
        return total + transaction.amount;
      },
      0
    );

    // Get all expense transactions
    const expenseTransactions = await Transaction.find({
      user: req.user.id,
      type: "expense",
    });

    // Calculate total expense
    const totalExpense = expenseTransactions.reduce(
      (total, transaction) => {
        return total + transaction.amount;
      },
      0
    );

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Category-wise expense breakdown
    const categoryWiseExpenses = await Transaction.aggregate([
    {
        $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
        type: "expense",
        },
    },
    {
        $group: {
        _id: "$category",
        total: {
            $sum: "$amount",
        },
        },
    },
    {
        $sort: {
        total: -1,
        },
    },
    ]);

    res.status(200).json({ 
    totalBalance, 
    totalIncome, 
    totalExpense, 
    recentTransactions,
    categoryWiseExpenses,
    });
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};