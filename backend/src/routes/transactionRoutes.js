const express = require("express");

// =====================================================
// CONTROLLERS
// =====================================================

const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const protect = require("../middleware/authMiddleware");


// =====================================================
// ROUTER
// =====================================================

const router = express.Router();


// =====================================================
// CREATE TRANSACTION
// =====================================================

router.post(
  "/",
  protect,
  createTransaction
);


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

router.get(
  "/",
  protect,
  getTransactions
);


// =====================================================
// GET SINGLE TRANSACTION
// =====================================================

router.get(
  "/:id",
  protect,
  getTransactionById
);


// =====================================================
// UPDATE TRANSACTION
// =====================================================

router.put(
  "/:id",
  protect,
  updateTransaction
);


// =====================================================
// DELETE TRANSACTION
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteTransaction
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;