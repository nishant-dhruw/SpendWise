import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

import "./Budgets.css";

interface Budget {
  id: number;
  category: string;
  limit: number;
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  accountName: string;
}

function Budgets() {
  // =========================================================
  // MASTER MONTHLY BUDGET
  // =========================================================

  const [monthlyBudget, setMonthlyBudget] =
    useState<number>(() => {
      const savedBudget =
        localStorage.getItem(
          "spendwise_monthly_budget"
        );

      if (savedBudget) {
        const parsedBudget = Number(savedBudget);

        if (
          Number.isFinite(parsedBudget) &&
          parsedBudget > 0
        ) {
          return parsedBudget;
        }
      }

      return 50000;
    });

  // =========================================================
  // BUDGETS
  // =========================================================

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem(
      "spendwise_budgets"
    );

    return savedBudgets
      ? JSON.parse(savedBudgets)
      : [
          {
            id: 1,
            category: "food",
            limit: 10000,
          },
          {
            id: 2,
            category: "transport",
            limit: 5000,
          },
          {
            id: 3,
            category: "shopping",
            limit: 8000,
          },
        ];
  });

  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const [transactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem(
      "spendwise_transactions"
    );

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });

  // =========================================================
  // SAVE BUDGETS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "spendwise_budgets",
      JSON.stringify(budgets)
    );
  }, [budgets]);

  // =========================================================
  // LOAD MASTER BUDGET
  // =========================================================

  useEffect(() => {
    const loadMonthlyBudget = () => {
      const savedBudget =
        localStorage.getItem(
          "spendwise_monthly_budget"
        );

      if (savedBudget) {
        const parsedBudget = Number(savedBudget);

        if (
          Number.isFinite(parsedBudget) &&
          parsedBudget > 0
        ) {
          setMonthlyBudget(parsedBudget);
        }
      }
    };

    loadMonthlyBudget();

    window.addEventListener(
      "storage",
      loadMonthlyBudget
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadMonthlyBudget
      );
    };
  }, []);

  // =========================================================
  // MODAL STATES
  // =========================================================

  const [showAddBudget, setShowAddBudget] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState<Budget | null>(null);

  const [deletingBudget, setDeletingBudget] =
    useState<Budget | null>(null);

  // =========================================================
  // FORM STATES
  // =========================================================

  const [newCategory, setNewCategory] =
    useState("");

  const [newLimit, setNewLimit] =
    useState("");

  const [budgetError, setBudgetError] =
    useState("");

  const [editError, setEditError] =
    useState("");

  // =========================================================
  // CATEGORY LABEL
  // =========================================================

  const getCategoryLabel = (
    category: string
  ) => {
    const labels: Record<string, string> = {
      food: "Food & Dining",
      transport: "Transport",
      shopping: "Shopping",
      bills: "Bills & Utilities",
      entertainment: "Entertainment",
      health: "Health",
      salary: "Salary",
      freelance: "Freelance",
      other: "Other",
    };

    return labels[category] || "Other";
  };

  // =========================================================
  // CATEGORY ICON
  // =========================================================

  const getCategoryIcon = (
    category: string
  ) => {
    const icons: Record<string, string> = {
      food: "🍔",
      transport: "🚕",
      shopping: "🛍️",
      bills: "💡",
      entertainment: "🎮",
      health: "🏥",
      salary: "💼",
      freelance: "💻",
      other: "💰",
    };

    return icons[category] || "💰";
  };

  // =========================================================
  // SPENDING FOR CURRENT MONTH
  // =========================================================

  const getSpentAmount = (
    category: string
  ) => {
    const now = new Date();

    const currentYear =
      now.getFullYear();

    const currentMonth =
      now.getMonth();

    return transactions
      .filter((transaction) => {
        // Only expenses
        if (
          transaction.type !== "expense"
        ) {
          return false;
        }

        // Match category
        if (
          transaction.category !== category
        ) {
          return false;
        }

        const transactionDate =
          new Date(transaction.date);

        // Only current month
        return (
          transactionDate.getFullYear() ===
            currentYear &&
          transactionDate.getMonth() ===
            currentMonth
        );
      })
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );
  };

  // =========================================================
  // BUDGET CALCULATIONS
  // =========================================================

  // Total of all category budgets
  const totalAllocated =
    budgets.reduce(
      (total, budget) =>
        total + budget.limit,
      0
    );

  // Amount of master budget not yet allocated
  const availableToAllocate =
    monthlyBudget - totalAllocated;

  // Total amount spent in categories
  const totalSpent =
    budgets.reduce(
      (total, budget) =>
        total +
        getSpentAmount(
          budget.category
        ),
      0
    );

  // Amount remaining based on actual spending
  const remainingAfterSpending =
    monthlyBudget - totalSpent;

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const openAddBudgetModal = () => {
    setNewCategory("");
    setNewLimit("");
    setBudgetError("");
    setShowAddBudget(true);
  };

  // =========================================================
  // CLOSE ADD MODAL
  // =========================================================

  const closeAddBudgetModal = () => {
    setShowAddBudget(false);
    setNewCategory("");
    setNewLimit("");
    setBudgetError("");
  };

  // =========================================================
  // ADD BUDGET
  // =========================================================

  const handleAddBudget = () => {
    const category = newCategory;
    const limit = Number(newLimit);

    // -----------------------------------------
    // CATEGORY VALIDATION
    // -----------------------------------------

    if (!category) {
      setBudgetError(
        "Please select a category."
      );

      return;
    }

    // -----------------------------------------
    // EMPTY AMOUNT VALIDATION
    // -----------------------------------------

    if (!newLimit.trim()) {
      setBudgetError(
        "Please enter a monthly budget."
      );

      return;
    }

    // -----------------------------------------
    // ZERO / NEGATIVE VALIDATION
    // -----------------------------------------

    if (
      !Number.isFinite(limit) ||
      limit <= 0
    ) {
      setBudgetError(
        "Budget must be greater than ₹0."
      );

      return;
    }

    // -----------------------------------------
    // DUPLICATE CATEGORY VALIDATION
    // -----------------------------------------

    const isDuplicate =
      budgets.some(
        (budget) =>
          budget.category === category
      );

    if (isDuplicate) {
      setBudgetError(
        `A ${getCategoryLabel(
          category
        )} budget already exists. Please edit the existing budget instead.`
      );

      return;
    }

    // -----------------------------------------
    // MASTER BUDGET VALIDATION
    // -----------------------------------------

    const newTotalAllocated =
      totalAllocated + limit;

    if (
      newTotalAllocated >
      monthlyBudget
    ) {
      const available =
        Math.max(
          monthlyBudget -
            totalAllocated,
          0
        );

      setBudgetError(
        `This budget exceeds your monthly limit. You only have ₹${available.toLocaleString(
          "en-IN"
        )} available to allocate.`
      );

      return;
    }

    // -----------------------------------------
    // CREATE BUDGET
    // -----------------------------------------

    const newBudget: Budget = {
      id: Date.now(),
      category,
      limit,
    };

    setBudgets(
      (currentBudgets) => [
        ...currentBudgets,
        newBudget,
      ]
    );

    closeAddBudgetModal();
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditBudgetModal = (
    budget: Budget
  ) => {
    setEditingBudget({
      ...budget,
    });

    setEditError("");
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeEditBudgetModal = () => {
    setEditingBudget(null);
    setEditError("");
  };

  // =========================================================
  // EDIT BUDGET
  // =========================================================

  const handleEditBudget = () => {
    if (!editingBudget) {
      return;
    }

    // -----------------------------------------
    // ZERO / NEGATIVE VALIDATION
    // -----------------------------------------

    if (
      !Number.isFinite(
        editingBudget.limit
      ) ||
      editingBudget.limit <= 0
    ) {
      setEditError(
        "Budget must be greater than ₹0."
      );

      return;
    }

    // -----------------------------------------
    // DUPLICATE CATEGORY VALIDATION
    // -----------------------------------------

    const isDuplicate =
      budgets.some(
        (budget) =>
          budget.id !==
            editingBudget.id &&
          budget.category ===
            editingBudget.category
      );

    if (isDuplicate) {
      setEditError(
        `A ${getCategoryLabel(
          editingBudget.category
        )} budget already exists. Please choose another category.`
      );

      return;
    }

    // -----------------------------------------
    // CALCULATE NEW TOTAL ALLOCATION
    // -----------------------------------------

    const currentBudget =
      budgets.find(
        (budget) =>
          budget.id ===
          editingBudget.id
      );

    if (!currentBudget) {
      return;
    }

    const newTotalAllocated =
      totalAllocated -
      currentBudget.limit +
      editingBudget.limit;

    // -----------------------------------------
    // MASTER BUDGET VALIDATION
    // -----------------------------------------

    if (
      newTotalAllocated >
      monthlyBudget
    ) {
      const available =
        Math.max(
          monthlyBudget -
            (totalAllocated -
              currentBudget.limit),
          0
        );

      setEditError(
        `This change exceeds your monthly limit. You can allocate up to ₹${available.toLocaleString(
          "en-IN"
        )} for this budget.`
      );

      return;
    }

    // -----------------------------------------
    // UPDATE BUDGET
    // -----------------------------------------

    setBudgets(
      (currentBudgets) =>
        currentBudgets.map(
          (budget) =>
            budget.id ===
            editingBudget.id
              ? editingBudget
              : budget
        )
    );

    closeEditBudgetModal();
  };

  // =========================================================
  // DELETE BUDGET
  // =========================================================

  const handleDeleteBudget = (
    budget: Budget
  ) => {
    setDeletingBudget(budget);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const confirmDeleteBudget = () => {
    if (!deletingBudget) {
      return;
    }

    setBudgets(
      (currentBudgets) =>
        currentBudgets.filter(
          (currentBudget) =>
            currentBudget.id !==
            deletingBudget.id
        )
    );

    setDeletingBudget(null);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="budgets-page">

      <Sidebar />

      <section className="budgets-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="budgets-page-header">

          <div>
            <h1>
              Budgets
            </h1>

            <p>
              Plan and control your monthly spending
            </p>
          </div>

          <button
            className="budgets-page-add"
            onClick={
              openAddBudgetModal
            }
          >
            <Plus size={18} />

            Add Budget
          </button>

        </div>

        {/* =================================================
            BUDGET OVERVIEW
        ================================================= */}

        <section className="budgets-summary">

          {/* MASTER MONTHLY BUDGET */}

          <div className="budget-summary-card">

            <div className="budget-summary-icon">
              <Wallet size={20} />
            </div>

            <span>
              Monthly Budget
            </span>

            <strong>
              ₹
              {monthlyBudget.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Overall monthly spending limit
            </small>

          </div>

          {/* ALLOCATED */}

          <div className="budget-summary-card">

            <div className="budget-summary-icon">
              <TrendingUp size={20} />
            </div>

            <span>
              Allocated
            </span>

            <strong>
              ₹
              {totalAllocated.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Across category budgets
            </small>

          </div>

          {/* AVAILABLE */}

          <div className="budget-summary-card">

            <div className="budget-summary-icon">
              <AlertTriangle size={20} />
            </div>

            <span>
              Available to Allocate
            </span>

            <strong
              className={
                availableToAllocate >= 0
                  ? "budget-positive"
                  : "budget-negative"
              }
            >
              ₹
              {Math.max(
                availableToAllocate,
                0
              ).toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Still available for categories
            </small>

          </div>

        </section>

        {/* =================================================
            OVER-ALLOCATED WARNING
        ================================================= */}

        {availableToAllocate < 0 && (

          <div className="budget-form-error">
            Your category budgets exceed your
            monthly budget by ₹
            {Math.abs(
              availableToAllocate
            ).toLocaleString(
              "en-IN"
            )}
            . Please reduce one or more
            category budgets.
          </div>

        )}

        {/* =================================================
            BUDGET LIST
        ================================================= */}

        <section className="budgets-list-section">

          <div className="budgets-list-header">

            <div>
              <h2>
                Your Budgets
              </h2>

              <p>
                Track your spending limits by category
              </p>
            </div>

          </div>

          <div className="budgets-grid">

            {budgets.map(
              (budget) => {

                const spent =
                  getSpentAmount(
                    budget.category
                  );

                const percentage =
                  budget.limit > 0
                    ? (spent /
                        budget.limit) *
                      100
                    : 0;

                const cappedPercentage =
                  Math.min(
                    percentage,
                    100
                  );

                const status =
                  percentage >= 100
                    ? "danger"
                    : percentage >= 80
                    ? "warning"
                    : "safe";

                return (
                  <article
                    className="budget-card"
                    key={budget.id}
                  >

                    {/* TOP */}

                    <div className="budget-card-top">

                      <div className="budget-category">

                        <div
                          className={`budget-category-icon ${budget.category}`}
                        >
                          {getCategoryIcon(
                            budget.category
                          )}
                        </div>

                        <div>

                          <h3>
                            {getCategoryLabel(
                              budget.category
                            )}
                          </h3>

                          <span>
                            Monthly budget
                          </span>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="budget-actions">

                        <button
                          className="budget-edit-button"
                          onClick={() =>
                            openEditBudgetModal(
                              budget
                            )
                          }
                          title="Edit budget"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="budget-delete-button"
                          onClick={() =>
                            handleDeleteBudget(
                              budget
                            )
                          }
                          title="Delete budget"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </div>

                    {/* AMOUNTS */}

                    <div className="budget-amounts">

                      <div>

                        <span>
                          Spent
                        </span>

                        <strong>
                          ₹
                          {spent.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Limit
                        </span>

                        <strong>
                          ₹
                          {budget.limit.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* PROGRESS */}

                    <div className="budget-progress">

                      <div className="budget-progress-track">

                        <div
                          className={`budget-progress-bar ${status}`}
                          style={{
                            width:
                              `${cappedPercentage}%`,
                          }}
                        />

                      </div>

                      <div className="budget-progress-info">

                        <span>
                          {percentage.toFixed(
                            0
                          )}% used
                        </span>

                        <span
                          className={
                            status ===
                            "danger"
                              ? "budget-negative"
                              : ""
                          }
                        >
                          {spent <=
                          budget.limit
                            ? `₹${(
                                budget.limit -
                                spent
                              ).toLocaleString(
                                "en-IN"
                              )} left`
                            : `₹${(
                                spent -
                                budget.limit
                              ).toLocaleString(
                                "en-IN"
                              )} over`}
                        </span>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

            {/* =================================================
                ADD NEW BUDGET CARD
            ================================================= */}

            <button
              className="budget-add-card"
              onClick={
                openAddBudgetModal
              }
            >

              <div className="budget-add-icon">
                <Plus size={24} />
              </div>

              <strong>
                Add New Budget
              </strong>

              <span>
                Set a spending limit
              </span>

            </button>

          </div>

        </section>

        {/* =================================================
            ADD BUDGET MODAL
        ================================================= */}

        {showAddBudget && (

          <div
            className="budget-modal-overlay"
            onClick={
              closeAddBudgetModal
            }
          >

            <div
              className="budget-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="budget-modal-header">

                <div>

                  <h2>
                    Add Budget
                  </h2>

                  <p>
                    Set a category spending limit.
                  </p>

                </div>

                <button
                  className="budget-modal-close"
                  onClick={
                    closeAddBudgetModal
                  }
                  title="Close"
                >
                  ×
                </button>

              </div>

              {/* CATEGORY */}

              <label>
                Category
              </label>

              <select
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(
                    e.target.value
                  );

                  setBudgetError("");
                }}
              >

                <option
                  value=""
                  disabled
                >
                  Select category
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

                <option value="other">
                  Other
                </option>

              </select>

              {/* MONTHLY LIMIT */}

              <label>
                Monthly Limit
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={newLimit}
                placeholder="e.g. 10000"
                onChange={(e) => {
                  setNewLimit(
                    e.target.value
                  );

                  setBudgetError("");
                }}
              />

              {/* AVAILABLE AMOUNT */}

              <small className="budget-available-info">
                ₹
                {Math.max(
                  availableToAllocate,
                  0
                ).toLocaleString(
                  "en-IN"
                )}{" "}
                available to allocate
              </small>

              {/* ERROR */}

              {budgetError && (
                <p className="budget-form-error">
                  {budgetError}
                </p>
              )}

              {/* BUTTONS */}

              <div className="budget-modal-buttons">

                <button
                  onClick={
                    closeAddBudgetModal
                  }
                >
                  Cancel
                </button>

                <button
                  className="budget-primary-button"
                  onClick={
                    handleAddBudget
                  }
                >
                  Add Budget
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            EDIT BUDGET MODAL
        ================================================= */}

        {editingBudget && (

          <div
            className="budget-modal-overlay"
            onClick={
              closeEditBudgetModal
            }
          >

            <div
              className="budget-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="budget-modal-header">

                <div>

                  <h2>
                    Edit Budget
                  </h2>

                  <p>
                    Update your category spending limit.
                  </p>

                </div>

                <button
                  className="budget-modal-close"
                  onClick={
                    closeEditBudgetModal
                  }
                  title="Close"
                >
                  ×
                </button>

              </div>

              {/* CATEGORY */}

              <label>
                Category
              </label>

              <select
                value={
                  editingBudget.category
                }
                onChange={(e) => {

                  setEditingBudget({
                    ...editingBudget,
                    category:
                      e.target.value,
                  });

                  setEditError("");
                }}
              >

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

                <option value="other">
                  Other
                </option>

              </select>

              {/* MONTHLY LIMIT */}

              <label>
                Monthly Limit
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={
                  editingBudget.limit
                }
                onChange={(e) => {

                  setEditingBudget({
                    ...editingBudget,
                    limit:
                      Number(
                        e.target.value
                      ),
                  });

                  setEditError("");
                }}
              />

              {/* AVAILABLE AMOUNT */}

              <small className="budget-available-info">
                Current category:
                ₹
                {editingBudget.limit.toLocaleString(
                  "en-IN"
                )}
              </small>

              {/* ERROR */}

              {editError && (
                <p className="budget-form-error">
                  {editError}
                </p>
              )}

              {/* BUTTONS */}

              <div className="budget-modal-buttons">

                <button
                  onClick={
                    closeEditBudgetModal
                  }
                >
                  Cancel
                </button>

                <button
                  className="budget-primary-button"
                  onClick={
                    handleEditBudget
                  }
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            DELETE CONFIRMATION MODAL
        ================================================= */}

        {deletingBudget && (

          <div
            className="budget-modal-overlay"
            onClick={() =>
              setDeletingBudget(null)
            }
          >

            <div
              className="budget-modal delete-budget-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* DELETE ICON */}

              <div className="delete-budget-icon">
                <Trash2 size={24} />
              </div>

              {/* CONTENT */}

              <div className="delete-budget-content">

                <h2>
                  Delete Budget?
                </h2>

                <p>
                  Are you sure you want to
                  delete the{" "}
                  <strong>
                    {getCategoryLabel(
                      deletingBudget.category
                    )}
                  </strong>{" "}
                  budget?
                </p>

                <span>
                  This action cannot be undone.
                </span>

              </div>

              {/* BUTTONS */}

              <div className="budget-modal-buttons">

                <button
                  onClick={() =>
                    setDeletingBudget(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  className="delete-confirm-button"
                  onClick={
                    confirmDeleteBudget
                  }
                >
                  <Trash2 size={16} />

                  Delete Budget
                </button>

              </div>

            </div>

          </div>
        )}

      </section>

    </main>
  );
}

export default Budgets;