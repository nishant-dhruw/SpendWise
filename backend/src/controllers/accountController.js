const Account = require("../models/Account");
const Transaction = require("../models/Transaction");


// =====================================================
// NORMALIZE ACCOUNT TYPE
// =====================================================

const normalizeAccountType = (type) => {

  if (!type) {

    return type;

  }

  return type
    .trim()
    .toLowerCase();

};


// =====================================================
// CREATE ACCOUNT
// =====================================================

const createAccount = async (req, res) => {

  try {

    const {
      name,
      type,
      balance,
    } = req.body;


    // ===============================================
    // CHECK REQUIRED FIELDS
    // ===============================================

    if (!name || !type) {

      return res.status(400).json({

        message:
          "Name and account type are required.",

      });

    }


    // ===============================================
    // NORMALIZE TYPE
    // ===============================================

    const normalizedType =
      normalizeAccountType(type);


    // ===============================================
    // CREATE ACCOUNT
    // ===============================================

    const account =
      await Account.create({

        name:
          name.trim(),

        type:
          normalizedType,

        balance:
          Number(balance) || 0,

        user:
          req.user.id,

      });


    // ===============================================
    // RESPONSE
    // ===============================================

    res.status(201).json({

      message:
        "Account created successfully",

      account,

    });


  } catch (error) {

    console.error(
      "Error creating account:",
      error
    );


    res.status(500).json({

      message:
        "Error creating account",

      error:
        error.message,

    });

  }

};


// =====================================================
// GET ALL ACCOUNTS
// =====================================================

const getAccounts = async (req, res) => {

  try {

    const accounts =
      await Account.find({

        user:
          req.user.id,

      })
      .sort({

        createdAt:
          -1,

      });


    res.status(200).json({

      accounts,

    });


  } catch (error) {

    console.error(
      "Error fetching accounts:",
      error
    );


    res.status(500).json({

      message:
        "Error fetching accounts",

      error:
        error.message,

    });

  }

};


// =====================================================
// UPDATE ACCOUNT
// =====================================================

const updateAccount = async (req, res) => {

  try {

    const {
      name,
      type,
      balance,
    } = req.body;


    // ===============================================
    // FIND ACCOUNT
    // ===============================================

    const account =
      await Account.findOne({

        _id:
          req.params.id,

        user:
          req.user.id,

      });


    // ===============================================
    // ACCOUNT NOT FOUND
    // ===============================================

    if (!account) {

      return res.status(404).json({

        message:
          "Account not found.",

      });

    }


    // ===============================================
    // CHECK FOR LINKED TRANSACTIONS
    // ===============================================

    const transactionCount =
      await Transaction.countDocuments({

        account:
          account._id,

        user:
          req.user.id,

      });


    // ===============================================
    // UPDATE NAME
    // ===============================================

    if (
      name !== undefined
    ) {

      account.name =
        name.trim();

    }


    // ===============================================
    // UPDATE TYPE
    // ===============================================

    if (
      type !== undefined
    ) {

      account.type =
        normalizeAccountType(type);

    }


    // ===============================================
    // UPDATE BALANCE
    // ===============================================

    if (
      balance !== undefined
    ) {

      // ---------------------------------------------
      // DO NOT ALLOW DIRECT BALANCE EDITING WHEN
      // TRANSACTIONS ALREADY EXIST
      // ---------------------------------------------

      if (transactionCount > 0) {

        return res.status(400).json({

          message:
            `This account has ${transactionCount} transaction${transactionCount > 1 ? "s" : ""}. Its balance cannot be edited directly. Add, edit, or delete transactions to change the account balance.`,

        });

      }


      account.balance =
        Number(balance);

    }


    // ===============================================
    // SAVE ACCOUNT
    // ===============================================

    await account.save();


    // ===============================================
    // SUCCESS RESPONSE
    // ===============================================

    res.status(200).json({

      message:
        "Account updated successfully",

      account,

    });


  } catch (error) {

    console.error(
      "Error updating account:",
      error
    );


    res.status(500).json({

      message:
        "Error updating account",

      error:
        error.message,

    });

  }

};


// =====================================================
// DELETE ACCOUNT
// =====================================================

const deleteAccount = async (req, res) => {

  try {

    // ===============================================
    // FIND ACCOUNT
    // ===============================================

    const account =
      await Account.findOne({

        _id:
          req.params.id,

        user:
          req.user.id,

      });


    // ===============================================
    // ACCOUNT NOT FOUND
    // ===============================================

    if (!account) {

      return res.status(404).json({

        message:
          "Account not found.",

      });

    }


    // ===============================================
    // CHECK FOR LINKED TRANSACTIONS
    // ===============================================

    const transactionCount =
      await Transaction.countDocuments({

        account:
          account._id,

        user:
          req.user.id,

      });


    // ===============================================
    // PREVENT DELETE IF TRANSACTIONS EXIST
    // ===============================================

    if (transactionCount > 0) {

      return res.status(400).json({

        message:
          `This account cannot be deleted because it has ${transactionCount} transaction${transactionCount > 1 ? "s" : ""}. Please delete or move the transactions first.`,

      });

    }


    // ===============================================
    // DELETE ACCOUNT
    // ===============================================

    await account.deleteOne();


    // ===============================================
    // SUCCESS RESPONSE
    // ===============================================

    res.status(200).json({

      message:
        "Account deleted successfully",

    });


  } catch (error) {

    console.error(
      "Error deleting account:",
      error
    );


    res.status(500).json({

      message:
        "Error deleting account",

      error:
        error.message,

    });

  }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  createAccount,

  getAccounts,

  updateAccount,

  deleteAccount,

};