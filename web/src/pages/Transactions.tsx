import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Pencil,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";

import "./Transactions.css";

interface Transaction {
    id: number;
    type: "income" | "expense";
    category: string;
    description: string;
    amount: number;
    date: string;
    accountName: string;
}

interface Account {
    name: string;
    type: string;
    balance: number;
}

function Transactions() {

  // ================= TRANSACTIONS =================

  const [transactions, setTransactions] =
    useState<Transaction[]>(() => {

      const savedTransactions =
        localStorage.getItem(
          "spendwise_transactions"
        );

      return savedTransactions
        ? JSON.parse(savedTransactions)
        : [];
    });


  // ================= ACCOUNTS =================

    const [accounts, setAccounts] =
        useState<Account[]>(() => {

        const savedAccounts =
            localStorage.getItem(
            "spendwise_accounts"
            );

        return savedAccounts
            ? JSON.parse(savedAccounts)
            : [];
        });


    // ================= UI =================

    const [showAddTransaction, setShowAddTransaction] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const [categoryFilter, setCategoryFilter] =
        useState("all");

    const [dateFilter, setDateFilter] =
        useState("all");

    const [sortOrder, setSortOrder] =
        useState<"newest" | "oldest">("newest");

    const [transactionToDelete, setTransactionToDelete] =
        useState<Transaction | null>(null);

    const [transactionToEdit, setTransactionToEdit] =
        useState<Transaction | null>(null);


    // ================= SAVE =================

    useEffect(() => {

        localStorage.setItem(
        "spendwise_transactions",
        JSON.stringify(transactions)
        );

    }, [transactions]);


    useEffect(() => {

        localStorage.setItem(
        "spendwise_accounts",
        JSON.stringify(accounts)
        );

    }, [accounts]);


  // ================= ADD =================

    const handleAddTransaction = (
        newTransaction: Transaction
    ) => {

        setTransactions((currentTransactions) => [
        newTransaction,
        ...currentTransactions,
        ]);


        setAccounts((currentAccounts) =>
        currentAccounts.map((account) => {

            if (
            account.name !==
            newTransaction.accountName
            ) {
            return account;
            }


            const newBalance =
            newTransaction.type === "income"
                ? account.balance +
                newTransaction.amount
                : account.balance -
                newTransaction.amount;


            return {
            ...account,
            balance: newBalance,
            };

        })
        );


        setShowAddTransaction(false);
    };

    // ================= EDIT =================

const handleEditTransaction = (
    updatedTransaction: Transaction
) => {

    setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
            transaction.id === updatedTransaction.id
                ? updatedTransaction
                : transaction
        )
    );


    setAccounts((currentAccounts) =>
        currentAccounts.map((account) => {

            let balance = account.balance;


            // Remove old transaction effect

            if (
                account.name ===
                transactionToEdit?.accountName
            ) {

                if (
                    transactionToEdit.type === "income"
                ) {

                    balance -=
                        transactionToEdit.amount;

                } else {

                    balance +=
                        transactionToEdit.amount;

                }

            }


            // Apply new transaction effect

            if (
                account.name ===
                updatedTransaction.accountName
            ) {

                if (
                    updatedTransaction.type === "income"
                ) {

                    balance +=
                        updatedTransaction.amount;

                } else {

                    balance -=
                        updatedTransaction.amount;

                }

            }


            return {
                ...account,
                balance,
            };

        })
    );


    setTransactionToEdit(null);
};


  // ================= DELETE =================

    const handleDeleteTransaction = (
        transaction: Transaction
    ) => {

        setTransactions((currentTransactions) =>
        currentTransactions.filter(
            (currentTransaction) =>
            currentTransaction.id !==
            transaction.id
        )
        );


        setAccounts((currentAccounts) =>
        currentAccounts.map((account) => {

            if (
            account.name !==
            transaction.accountName
            ) {
            return account;
            }


            const restoredBalance =
            transaction.type === "expense"
                ? account.balance +
                transaction.amount
                : account.balance -
                transaction.amount;


            return {
            ...account,
            balance: restoredBalance,
            };

        })
        );


        setTransactionToDelete(null);
    };


  // ================= FILTER =================

    const filteredTransactions =
        transactions.filter((transaction) => {

            // ================= SEARCH =================

            const matchesSearch =
            transaction.description
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            transaction.accountName
                .toLowerCase()
                .includes(search.toLowerCase());


            // ================= TYPE =================

            const matchesType =
            typeFilter === "all" ||
            transaction.type === typeFilter;


            // ================= CATEGORY =================

            const matchesCategory =
            categoryFilter === "all" ||
            transaction.category === categoryFilter;


            // ================= DATE =================

            const transactionDate =
            new Date(transaction.date);

            const today = new Date();

            const todayDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
            );


            const matchesDate = (() => {

            if (dateFilter === "all") {
                return true;
            }


            if (dateFilter === "today") {

                return (
                transactionDate.getFullYear() ===
                    todayDate.getFullYear() &&
                transactionDate.getMonth() ===
                    todayDate.getMonth() &&
                transactionDate.getDate() ===
                    todayDate.getDate()
                );

            }


            if (dateFilter === "week") {

                const startOfWeek = new Date(
                todayDate
                );

                const day =
                startOfWeek.getDay();

                startOfWeek.setDate(
                startOfWeek.getDate() - day
                );


                const endOfWeek = new Date(
                startOfWeek
                );

                endOfWeek.setDate(
                endOfWeek.getDate() + 6
                );


                return (
                transactionDate >= startOfWeek &&
                transactionDate <= endOfWeek
                );

            }


            if (dateFilter === "month") {

                return (
                transactionDate.getFullYear() ===
                    todayDate.getFullYear() &&
                transactionDate.getMonth() ===
                    todayDate.getMonth()
                );

            }


            if (dateFilter === "lastMonth") {

                const lastMonth =
                new Date(
                    todayDate.getFullYear(),
                    todayDate.getMonth() - 1,
                    1
                );


                return (
                transactionDate.getFullYear() ===
                    lastMonth.getFullYear() &&
                transactionDate.getMonth() ===
                    lastMonth.getMonth()
                );

            }


            return true;

            })();


    return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesDate
        );

    });

        // ================= SORT =================

        const sortedTransactions =
            [...filteredTransactions].sort(
                (a, b) => {

                    const dateA =
                        new Date(a.date).getTime();

                    const dateB =
                        new Date(b.date).getTime();

                    return sortOrder === "newest"
                        ? dateB - dateA
                        : dateA - dateB;
                }
            );


  // ================= SUMMARY =================

  const totalIncome =
    transactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );


  const totalExpenses =
    transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );


  const netAmount =
    totalIncome - totalExpenses;


  // ================= ICON =================

  const getCategoryIcon = (
    category: string
  ) => {

    if (category === "food") return "🍔";
    if (category === "transport") return "🚕";
    if (category === "shopping") return "🛍️";
    if (category === "salary") return "💼";
    if (category === "bills") return "💡";
    if (category === "entertainment") return "🎮";
    if (category === "health") return "🏥";
    if (category === "freelance") return "💻";

    return "💰";
  };


  return (

    <main className="transactions-page">

      <Sidebar />

      <section className="transactions-main">

        {/* ================= HEADER ================= */}

        <div className="transactions-page-header">

          <div>

            <h1>
              Transactions
            </h1>

            <p>
              Manage your income and expenses
            </p>

          </div>


          <button
            className="transactions-page-add"
            onClick={() =>
              setShowAddTransaction(true)
            }
          >

            <Plus size={18} />

            Add Transaction

          </button>

        </div>


        {/* ================= SUMMARY ================= */}

        <section className="transactions-summary">

          <div className="transaction-summary-card">

            <span>
              Total Income
            </span>

            <strong className="summary-income">

              <ArrowUpRight size={18} />

              ₹
              {totalIncome.toLocaleString(
                "en-IN"
              )}

            </strong>

          </div>


          <div className="transaction-summary-card">

            <span>
              Total Expenses
            </span>

            <strong className="summary-expense">

              <ArrowDownRight size={18} />

              ₹
              {totalExpenses.toLocaleString(
                "en-IN"
              )}

            </strong>

          </div>


          <div className="transaction-summary-card">

            <span>
              Net Amount
            </span>

            <strong
              className={
                netAmount >= 0
                  ? "summary-income"
                  : "summary-expense"
              }
            >

              ₹
              {netAmount.toLocaleString(
                "en-IN"
              )}

            </strong>

          </div>

        </section>


        {/* ================= TRANSACTIONS CARD ================= */}

        <section className="transactions-page-card">

          {/* Filters */}

          <div className="transactions-filters">

            <div className="transaction-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
            >

              <option value="all">
                All Types
              </option>

              <option value="income">
                Income
              </option>

              <option value="expense">
                Expense
              </option>

            </select>


            <select
                value={categoryFilter}
                onChange={(e) =>
                    setCategoryFilter(e.target.value)
                }
                >

                <option value="all">
                    All Categories
                </option>

                <option value="food">
                    Food & Dining
                </option>

                <option value="transport">
                    Transport
                </option>

                <option value="shopping">
                    Shopping
                </option>

                <option value="bills">
                    Bills & Utilities
                </option>

                <option value="entertainment">
                    Entertainment
                </option>

                <option value="health">
                    Health
                </option>

                <option value="salary">
                    Salary
                </option>

                <option value="freelance">
                    Freelance
                </option>

                <option value="other">
                    Other
                </option>

                </select>

            <select
                value={dateFilter}
                onChange={(e) =>
                    setDateFilter(e.target.value)
                }
                >

                <option value="all">
                    All Dates
                </option>

                <option value="today">
                    Today
                </option>

                <option value="week">
                    This Week
                </option>

                <option value="month">
                    This Month
                </option>

                <option value="lastMonth">
                    Last Month
                </option>

                </select>

                <select
                    value={sortOrder}
                    onChange={(e) =>
                        setSortOrder(
                            e.target.value as "newest" | "oldest"
                        )
                    }
                >
                    <option value="newest">
                        Newest First
                    </option>

                    <option value="oldest">
                        Oldest First
                    </option>
                </select>

        </div>


          {/* List */}

        <div className="transactions-page-list">

            {filteredTransactions.length === 0 ? (

            <div className="transactions-empty">

                <div>
                    💸
                </div>

                <h3>
                    No transactions found
                </h3>

                <p>
                    Try changing your filters
                    or add a new transaction.
                </p>

            </div>

            ) : (

            sortedTransactions.map(
                (transaction) => (

                <div
                    className="transactions-page-row"
                    key={transaction.id}
                >

                    <div className="transactions-page-left">

                    <div
                        className={`transactions-page-icon ${transaction.category}`}
                    >
                        {getCategoryIcon(
                            transaction.category
                        )}
                    </div>


                    <div>

                        <strong>
                            {transaction.description}
                        </strong>

                        <span>
                            {transaction.category}
                            {" · "}
                            {transaction.accountName}
                        </span>

                        <small>
                            {transaction.date}
                        </small>

                    </div>

                    </div>


                    <div className="transactions-page-right">

                      <strong
                        className={
                          transaction.type ===
                          "income"
                            ? "transaction-income"
                            : "transaction-expense"
                        }
                      >

                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}

                        ₹
                        {transaction.amount.toLocaleString(
                          "en-IN"
                        )}

                      </strong>


                      <button
                        className="transaction-page-delete"
                        onClick={() =>
                          setTransactionToDelete(
                            transaction
                          )
                        }
                      >

                        <Trash2 size={15} />

                      </button>

                      <button
                          className="transaction-page-edit"
                          onClick={() =>
                              setTransactionToEdit({
                                  ...transaction,
                              })
                          }
                      >
                          <Pencil size={15} />
                      </button>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

      </section>


      {/* ================= ADD MODAL ================= */}

      {showAddTransaction && (

        <AddTransactionModal
          onClose={() =>
            setShowAddTransaction(false)
          }
          onAddTransaction={
            handleAddTransaction
          }
          accounts={accounts}
        />

      )}

      {/* ================= EDIT MODAL ================= */}

      {transactionToEdit && (

          <EditTransactionModal
              transaction={transactionToEdit}
              accounts={accounts}
              onClose={() =>
                  setTransactionToEdit(null)
              }
              onSaveTransaction={
                  handleEditTransaction
              }
          />

      )}


      {/* ================= DELETE MODAL ================= */}

      {transactionToDelete && (

        <div
          className="delete-confirm-overlay"
          onClick={() =>
            setTransactionToDelete(null)
          }
        >

          <div
            className="delete-confirm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="delete-confirm-icon">

              <Trash2 size={22} />

            </div>


            <h3>
              Delete Transaction?
            </h3>


            <p>
              Are you sure you want to
              delete this transaction?
            </p>


            <div className="delete-confirm-details">

              <strong>
                {transactionToDelete.description}
              </strong>

              <span
                className={
                  transactionToDelete.type ===
                  "income"
                    ? "transaction-income"
                    : "transaction-expense"
                }
              >

                {transactionToDelete.type ===
                "income"
                  ? "+"
                  : "-"}

                ₹
                {transactionToDelete.amount.toLocaleString(
                  "en-IN"
                )}

              </span>

            </div>


            <p className="delete-confirm-note">

              This will update the balance of{" "}

              <strong>
                {transactionToDelete.accountName}
              </strong>.

            </p>


            <div className="delete-confirm-actions">

              <button
                className="delete-cancel-button"
                onClick={() =>
                  setTransactionToDelete(null)
                }
              >
                Cancel
              </button>


              <button
                className="delete-confirm-button"
                onClick={() =>
                  handleDeleteTransaction(
                    transactionToDelete
                  )
                }
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Transactions;