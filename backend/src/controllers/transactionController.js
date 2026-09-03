const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date, account } = req.body;

    // Check if account belongs to logged-in user
    const existingAccount = await Account.findOne({
      _id: account,
      user: req.user.id,
    });

    if (!existingAccount) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      type,
      amount,
      category,
      description,
      date,
      account,
      user: req.user.id,
    });

    // Update account balance
    if (type === "income") {
      existingAccount.balance += amount;
    } else if (type === "expense") {
      existingAccount.balance -= amount;
    }

    await existingAccount.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    });

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE TRANSACTION
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TRANSACTION
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const { type, amount, category, description, date } = req.body;

    if (type !== undefined) {
      transaction.type = type;
    }

    if (amount !== undefined) {
      transaction.amount = amount;
    }

    if (category !== undefined) {
      transaction.category = category;
    }

    if (description !== undefined) {
      transaction.description = description;
    }

    if (date !== undefined) {
      transaction.date = date;
    }

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
  try {
    // Find transaction belonging to logged-in user
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // Find the account
    const account = await Account.findOne({
      _id: transaction.account,
      user: req.user.id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Restore account balance
    if (transaction.type === "income") {
      account.balance -= transaction.amount;
    } else if (transaction.type === "expense") {
      account.balance += transaction.amount;
    }

    await account.save();

    // Delete transaction
    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};