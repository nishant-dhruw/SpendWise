const express = require("express");

const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE TRANSACTION
router.post("/", authMiddleware, createTransaction);

// GET ALL TRANSACTIONS
router.get("/", authMiddleware, getTransactions);

// GET SINGLE TRANSACTION
router.get("/:id", authMiddleware, getTransactionById);

// UPDATE TRANSACTION
router.put("/:id", authMiddleware, updateTransaction);

// DELETE TRANSACTION
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;