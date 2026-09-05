const Transaction = require("../models/Transaction");
const Account = require("../models/Account");


// =====================================================
// CREATE TRANSACTION
// =====================================================

const createTransaction = async (req, res) => {

  try {

    const {
      type,
      amount,
      category,
      description,
      date,
      account,
    } = req.body;


    // ===============================================
    // CHECK IF ACCOUNT BELONGS TO LOGGED-IN USER
    // ===============================================

    const existingAccount =
      await Account.findOne({

        _id: account,

        user: req.user.id,

      });


    if (!existingAccount) {

      return res.status(404).json({

        message: "Account not found",

      });

    }


    // ===============================================
    // CREATE TRANSACTION
    // ===============================================

    const transaction =
      await Transaction.create({

        type,

        amount: Number(amount),

        category,

        description,

        date,

        account,

        user: req.user.id,

      });


    // ===============================================
    // UPDATE ACCOUNT BALANCE
    // ===============================================

    console.log(
      "Balance before update:",
      existingAccount.balance
    );

    console.log(
      "Transaction type:",
      type
    );

    console.log(
      "Transaction amount:",
      amount
    );


    if (type === "income") {

      existingAccount.balance +=
        Number(amount);

    }

    else if (type === "expense") {

      existingAccount.balance -=
        Number(amount);

    }


    // ===============================================
    // SAVE UPDATED ACCOUNT
    // ===============================================

    await existingAccount.save();


    console.log(
      "Balance after save:",
      existingAccount.balance
    );


    const updatedAccount =
      await Account.findById(
        existingAccount._id
      );


    console.log(
      "DATABASE BALANCE:",
      updatedAccount.balance
    );


    // ===============================================
    // RESPONSE
    // ===============================================

    res.status(201).json({

      message:
        "Transaction created successfully",

      transaction,

    });

  } catch (error) {

    console.error(
      "Create transaction error:",
      error
    );


    res.status(500).json({

      message:
        error.message,

    });

  }

};


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

const getTransactions = async (req, res) => {

  try {

    const transactions =
      await Transaction.find({

        user: req.user.id,

      });


    res.status(200).json({

      transactions,

    });

  } catch (error) {

    console.error(
      "Get transactions error:",
      error
    );


    res.status(500).json({

      message:
        error.message,

    });

  }

};


// =====================================================
// GET SINGLE TRANSACTION
// =====================================================

const getTransactionById = async (req, res) => {

  try {

    const transaction =
      await Transaction.findOne({

        _id:
          req.params.id,

        user:
          req.user.id,

      });


    if (!transaction) {

      return res.status(404).json({

        message:
          "Transaction not found",

      });

    }


    res.status(200).json({

      transaction,

    });

  } catch (error) {

    console.error(
      "Get transaction error:",
      error
    );


    res.status(500).json({

      message:
        error.message,

    });

  }

};


// =====================================================
// UPDATE TRANSACTION
// =====================================================

const updateTransaction = async (req, res) => {

  try {

    // ===============================================
    // FIND OLD TRANSACTION
    // ===============================================

    const transaction =
      await Transaction.findOne({

        _id:
          req.params.id,

        user:
          req.user.id,

      });


    if (!transaction) {

      return res.status(404).json({

        message:
          "Transaction not found",

      });

    }


    // ===============================================
    // FIND OLD ACCOUNT
    // ===============================================

    const oldAccount =
      await Account.findOne({

        _id:
          transaction.account,

        user:
          req.user.id,

      });


    if (!oldAccount) {

      return res.status(404).json({

        message:
          "Account not found",

      });

    }


    // ===============================================
    // REVERSE OLD TRANSACTION EFFECT
    //
    // INCOME:
    // OLD EFFECT WAS + AMOUNT
    // SO REMOVE IT WITH - AMOUNT
    //
    // EXPENSE:
    // OLD EFFECT WAS - AMOUNT
    // SO REMOVE IT WITH + AMOUNT
    // ===============================================

    if (
      transaction.type ===
      "income"
    ) {

      oldAccount.balance -=
        transaction.amount;

    }

    else if (
      transaction.type ===
      "expense"
    ) {

      oldAccount.balance +=
        transaction.amount;

    }


    // ===============================================
    // GET UPDATED VALUES
    // ===============================================

    const {

      type,

      amount,

      category,

      description,

      date,

      account,

    } = req.body;


    // ===============================================
    // SELECT NEW ACCOUNT
    //
    // IF ACCOUNT WAS NOT CHANGED,
    // USE OLD ACCOUNT
    // ===============================================

    let newAccount =
      oldAccount;


    if (

      account !== undefined

      &&

      account.toString() !==
      transaction.account.toString()

    ) {


      newAccount =
        await Account.findOne({

          _id:
            account,

          user:
            req.user.id,

        });


      if (!newAccount) {

        return res.status(404).json({

          message:
            "New account not found",

        });

      }

    }


    // ===============================================
    // UPDATE TRANSACTION TYPE
    // ===============================================

    if (
      type !== undefined
    ) {

      transaction.type =
        type;

    }


    // ===============================================
    // UPDATE TRANSACTION AMOUNT
    // ===============================================

    if (
      amount !== undefined
    ) {

      transaction.amount =
        Number(amount);

    }


    // ===============================================
    // UPDATE CATEGORY
    // ===============================================

    if (
      category !== undefined
    ) {

      transaction.category =
        category;

    }


    // ===============================================
    // UPDATE DESCRIPTION
    // ===============================================

    if (
      description !== undefined
    ) {

      transaction.description =
        description;

    }


    // ===============================================
    // UPDATE DATE
    // ===============================================

    if (
      date !== undefined
    ) {

      transaction.date =
        date;

    }


    // ===============================================
    // UPDATE ACCOUNT
    // ===============================================

    if (
      account !== undefined
    ) {

      transaction.account =
        account;

    }


    // ===============================================
    // APPLY NEW TRANSACTION EFFECT
    //
    // INCOME:
    // ADD MONEY
    //
    // EXPENSE:
    // SUBTRACT MONEY
    // ===============================================

    if (
      transaction.type ===
      "income"
    ) {

      newAccount.balance +=
        transaction.amount;

    }

    else if (
      transaction.type ===
      "expense"
    ) {

      newAccount.balance -=
        transaction.amount;

    }


    // ===============================================
    // SAVE OLD ACCOUNT
    //
    // THIS CONTAINS THE REVERSED OLD EFFECT
    // ===============================================

    await oldAccount.save();


    // ===============================================
    // SAVE NEW ACCOUNT
    //
    // IF THE TRANSACTION WAS MOVED TO A
    // DIFFERENT ACCOUNT
    // ===============================================

    if (

      newAccount._id.toString()

      !==

      oldAccount._id.toString()

    ) {

      await newAccount.save();

    }

    else {

      // Same account.
      // Save the final updated balance.

      await newAccount.save();

    }


    // ===============================================
    // SAVE TRANSACTION
    // ===============================================

    await transaction.save();


    // ===============================================
    // RESPONSE
    // ===============================================

    res.status(200).json({

      message:
        "Transaction updated successfully",

      transaction,

    });

  } catch (error) {

    console.error(
      "Update transaction error:",
      error
    );


    res.status(500).json({

      message:
        error.message,

    });

  }

};


// =====================================================
// DELETE TRANSACTION
// =====================================================

const deleteTransaction = async (req, res) => {

  try {

    // ===============================================
    // FIND TRANSACTION
    // ===============================================

    const transaction =
      await Transaction.findOne({

        _id:
          req.params.id,

        user:
          req.user.id,

      });


    if (!transaction) {

      return res.status(404).json({

        message:
          "Transaction not found",

      });

    }


    // ===============================================
    // FIND ACCOUNT
    // ===============================================

    const account =
    await Account.findOne({

      _id:
        transaction.account,

      user:
        req.user.id,

    });


  // =====================================================
  // IF ACCOUNT NO LONGER EXISTS
  // DELETE THE ORPHAN TRANSACTION
  // =====================================================

  if (!account) {

    await transaction.deleteOne();

    return res.status(200).json({

      message:
        "Transaction deleted successfully. The original account no longer exists.",

    });

  }


    // ===============================================
    // REVERSE TRANSACTION EFFECT
    // ===============================================

    if (
      transaction.type ===
      "income"
    ) {

      account.balance -=
        transaction.amount;

    }

    else if (
      transaction.type ===
      "expense"
    ) {

      account.balance +=
        transaction.amount;

    }


    // ===============================================
    // SAVE ACCOUNT
    // ===============================================

    await account.save();


    // ===============================================
    // DELETE TRANSACTION
    // ===============================================

    await transaction.deleteOne();


    // ===============================================
    // RESPONSE
    // ===============================================

    res.status(200).json({

      message:
        "Transaction deleted successfully",

    });

  } catch (error) {

    console.error(
      "Delete transaction error:",
      error
    );


    res.status(500).json({

      message:
        error.message,

    });

  }

};


// =====================================================
// EXPORT CONTROLLER FUNCTIONS
// =====================================================

module.exports = {

  createTransaction,

  getTransactions,

  getTransactionById,

  updateTransaction,

  deleteTransaction,

};