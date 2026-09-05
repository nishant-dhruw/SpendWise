const express = require("express");

const {

  createAccount,

  getAccounts,

  updateAccount,

  deleteAccount,

} = require("../controllers/accountController");


const authMiddleware =
  require("../middleware/authMiddleware");


const router =
  express.Router();


// =====================================================
// CREATE ACCOUNT
// =====================================================

router.post(
  "/",
  authMiddleware,
  createAccount
);


// =====================================================
// GET ALL ACCOUNTS
// =====================================================

router.get(
  "/",
  authMiddleware,
  getAccounts
);


// =====================================================
// UPDATE ACCOUNT
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  updateAccount
);


// =====================================================
// DELETE ACCOUNT
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteAccount
);


module.exports =
  router;