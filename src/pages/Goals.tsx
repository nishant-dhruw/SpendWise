import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Target,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

import "./Goals.css";

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  category: string;
}

function Goals() {
  // =========================================================
  // GOALS
  // =========================================================

  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem(
      "spendwise_goals"
    );

    return savedGoals
      ? JSON.parse(savedGoals)
      : [];
  });

  // =========================================================
  // SAVE GOALS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "spendwise_goals",
      JSON.stringify(goals)
    );
  }, [goals]);

  // =========================================================
  // MODAL STATES
  // =========================================================

  const [showAddGoal, setShowAddGoal] =
    useState(false);

  const [editingGoal, setEditingGoal] =
    useState<Goal | null>(null);

  const [deletingGoal, setDeletingGoal] =
    useState<Goal | null>(null);

  // =========================================================
  // FORM STATES
  // =========================================================

  const [goalName, setGoalName] =
    useState("");

  const [targetAmount, setTargetAmount] =
    useState("");

  const [savedAmount, setSavedAmount] =
    useState("");

  const [targetDate, setTargetDate] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [goalError, setGoalError] =
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
      emergency: "Emergency Fund",
      travel: "Travel",
      education: "Education",
      vehicle: "Vehicle",
      home: "Home",
      electronics: "Electronics",
      investment: "Investment",
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
      emergency: "🛡️",
      travel: "✈️",
      education: "🎓",
      vehicle: "🚗",
      home: "🏠",
      electronics: "💻",
      investment: "📈",
      other: "🎯",
    };

    return icons[category] || "🎯";
  };

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const openAddGoalModal = () => {
    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");
    setTargetDate("");
    setCategory("");
    setGoalError("");

    setShowAddGoal(true);
  };

  // =========================================================
  // CLOSE ADD MODAL
  // =========================================================

  const closeAddGoalModal = () => {
    setShowAddGoal(false);

    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");
    setTargetDate("");
    setCategory("");
    setGoalError("");
  };

  // =========================================================
  // ADD GOAL
  // =========================================================

  const handleAddGoal = () => {
    const trimmedName = goalName.trim();

    const target = Number(
      targetAmount
    );

    const saved = savedAmount.trim()
      ? Number(savedAmount)
      : 0;

    // -----------------------------------------
    // NAME VALIDATION
    // -----------------------------------------

    if (!trimmedName) {
      setGoalError(
        "Please enter a goal name."
      );

      return;
    }

    // -----------------------------------------
    // TARGET AMOUNT VALIDATION
    // -----------------------------------------

    if (!targetAmount.trim()) {
      setGoalError(
        "Please enter a target amount."
      );

      return;
    }

    if (
      !Number.isFinite(target) ||
      target <= 0
    ) {
      setGoalError(
        "Target amount must be greater than ₹0."
      );

      return;
    }

    // -----------------------------------------
    // SAVED AMOUNT VALIDATION
    // -----------------------------------------

    if (
      !Number.isFinite(saved) ||
      saved < 0
    ) {
      setGoalError(
        "Saved amount cannot be negative."
      );

      return;
    }

    // -----------------------------------------
    // SAVED AMOUNT CANNOT EXCEED TARGET
    // -----------------------------------------

    if (saved > target) {
      setGoalError(
        "Saved amount cannot be greater than the target amount."
      );

      return;
    }

    // -----------------------------------------
    // CATEGORY VALIDATION
    // -----------------------------------------

    if (!category) {
      setGoalError(
        "Please select a goal category."
      );

      return;
    }

    // -----------------------------------------
    // DATE VALIDATION
    // -----------------------------------------

    if (!targetDate) {
      setGoalError(
        "Please select a target date."
      );

      return;
    }

    const selectedDate =
      new Date(targetDate);

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (selectedDate < today) {
      setGoalError(
        "Target date cannot be in the past."
      );

      return;
    }

    // -----------------------------------------
    // CREATE GOAL
    // -----------------------------------------

    const newGoal: Goal = {
      id: Date.now(),
      name: trimmedName,
      targetAmount: target,
      savedAmount: saved,
      targetDate,
      category,
    };

    setGoals(
      (currentGoals) => [
        ...currentGoals,
        newGoal,
      ]
    );

    closeAddGoalModal();
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditGoalModal = (
    goal: Goal
  ) => {
    setEditingGoal({
      ...goal,
    });

    setEditError("");
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeEditGoalModal = () => {
    setEditingGoal(null);
    setEditError("");
  };

  // =========================================================
  // EDIT GOAL
  // =========================================================

  const handleEditGoal = () => {
    if (!editingGoal) {
      return;
    }

    const trimmedName =
      editingGoal.name.trim();

    // -----------------------------------------
    // NAME
    // -----------------------------------------

    if (!trimmedName) {
      setEditError(
        "Please enter a goal name."
      );

      return;
    }

    // -----------------------------------------
    // TARGET
    // -----------------------------------------

    if (
      !Number.isFinite(
        editingGoal.targetAmount
      ) ||
      editingGoal.targetAmount <= 0
    ) {
      setEditError(
        "Target amount must be greater than ₹0."
      );

      return;
    }

    // -----------------------------------------
    // SAVED AMOUNT
    // -----------------------------------------

    if (
      !Number.isFinite(
        editingGoal.savedAmount
      ) ||
      editingGoal.savedAmount < 0
    ) {
      setEditError(
        "Saved amount cannot be negative."
      );

      return;
    }

    // -----------------------------------------
    // SAVED > TARGET
    // -----------------------------------------

    if (
      editingGoal.savedAmount >
      editingGoal.targetAmount
    ) {
      setEditError(
        "Saved amount cannot be greater than the target amount."
      );

      return;
    }

    // -----------------------------------------
    // CATEGORY
    // -----------------------------------------

    if (!editingGoal.category) {
      setEditError(
        "Please select a goal category."
      );

      return;
    }

    // -----------------------------------------
    // DATE
    // -----------------------------------------

    if (!editingGoal.targetDate) {
      setEditError(
        "Please select a target date."
      );

      return;
    }

    // -----------------------------------------
    // UPDATE
    // -----------------------------------------

    setGoals(
      (currentGoals) =>
        currentGoals.map(
          (goal) =>
            goal.id ===
            editingGoal.id
              ? {
                  ...editingGoal,
                  name: trimmedName,
                }
              : goal
        )
    );

    closeEditGoalModal();
  };

  // =========================================================
  // DELETE GOAL
  // =========================================================

  const handleDeleteGoal = (
    goal: Goal
  ) => {
    setDeletingGoal(goal);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const confirmDeleteGoal = () => {
    if (!deletingGoal) {
      return;
    }

    setGoals(
      (currentGoals) =>
        currentGoals.filter(
          (goal) =>
            goal.id !==
            deletingGoal.id
        )
    );

    setDeletingGoal(null);
  };

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalTargetAmount =
    goals.reduce(
      (total, goal) =>
        total +
        goal.targetAmount,
      0
    );

  const totalSavedAmount =
    goals.reduce(
      (total, goal) =>
        total +
        goal.savedAmount,
      0
    );

  const totalRemainingAmount =
    totalTargetAmount -
    totalSavedAmount;

  const overallProgress =
    totalTargetAmount > 0
      ? (totalSavedAmount /
          totalTargetAmount) *
        100
      : 0;

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (
    date: string
  ) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="goals-page">

      <Sidebar />

      <section className="goals-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="goals-page-header">

          <div>
            <h1>
              Goals
            </h1>

            <p>
              Save for what matters most to you
            </p>
          </div>

          <button
            className="goals-page-add"
            onClick={
              openAddGoalModal
            }
          >
            <Plus size={18} />

            Add Goal
          </button>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="goals-summary">

          {/* TOTAL GOALS */}

          <div className="goal-summary-card">

            <div className="goal-summary-icon">
              <Target size={20} />
            </div>

            <span>
              Total Goals
            </span>

            <strong>
              {goals.length}
            </strong>

            <small>
              Active savings goals
            </small>

          </div>

          {/* TOTAL SAVED */}

          <div className="goal-summary-card">

            <div className="goal-summary-icon">
              <IndianRupee size={20} />
            </div>

            <span>
              Total Saved
            </span>

            <strong>
              ₹
              {totalSavedAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Across all goals
            </small>

          </div>

          {/* REMAINING */}

          <div className="goal-summary-card">

            <div className="goal-summary-icon">
              <CalendarDays size={20} />
            </div>

            <span>
              Remaining
            </span>

            <strong>
              ₹
              {totalRemainingAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Amount left to reach goals
            </small>

          </div>

        </section>

        {/* =================================================
            OVERALL PROGRESS
        ================================================= */}

        <section className="goals-progress-section">

          <div className="goals-progress-header">

            <div>
              <h2>
                Overall Progress
              </h2>

              <p>
                Your progress across all savings goals
              </p>
            </div>

            <strong>
              {overallProgress.toFixed(
                0
              )}%
            </strong>

          </div>

          <div className="goals-progress-track">

            <div
              className="goals-progress-fill"
              style={{
                width: `${Math.min(
                  overallProgress,
                  100
                )}%`,
              }}
            />

          </div>

        </section>

        {/* =================================================
            GOALS LIST
        ================================================= */}

        <section className="goals-list-section">

          <div className="goals-list-header">

            <div>
              <h2>
                Your Goals
              </h2>

              <p>
                Track your savings progress
              </p>
            </div>

          </div>

          {goals.length === 0 ? (

            <div className="goals-empty-state">

              <div className="goals-empty-icon">
                <Target size={30} />
              </div>

              <h3>
                No goals yet
              </h3>

              <p>
                Create your first savings goal and start
                working towards it.
              </p>

              <button
                onClick={
                  openAddGoalModal
                }
              >
                <Plus size={17} />
                Create Your First Goal
              </button>

            </div>

          ) : (

            <div className="goals-grid">

              {goals.map(
                (goal) => {

                  const progress =
                    goal.targetAmount >
                    0
                      ? (goal.savedAmount /
                          goal.targetAmount) *
                        100
                      : 0;

                  const cappedProgress =
                    Math.min(
                      progress,
                      100
                    );

                  const remaining =
                    Math.max(
                      goal.targetAmount -
                        goal.savedAmount,
                      0
                    );

                  return (
                    <article
                      className="goal-card"
                      key={goal.id}
                    >

                      {/* TOP */}

                      <div className="goal-card-top">

                        <div className="goal-category">

                          <div
                            className={`goal-category-icon ${goal.category}`}
                          >
                            {getCategoryIcon(
                              goal.category
                            )}
                          </div>

                          <div>

                            <h3>
                              {goal.name}
                            </h3>

                            <span>
                              {getCategoryLabel(
                                goal.category
                              )}
                            </span>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="goal-actions">

                          <button
                            className="goal-edit-button"
                            onClick={() =>
                              openEditGoalModal(
                                goal
                              )
                            }
                            title="Edit goal"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            className="goal-delete-button"
                            onClick={() =>
                              handleDeleteGoal(
                                goal
                              )
                            }
                            title="Delete goal"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>

                      </div>

                      {/* AMOUNTS */}

                      <div className="goal-amounts">

                        <div>

                          <span>
                            Saved
                          </span>

                          <strong>
                            ₹
                            {goal.savedAmount.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Target
                          </span>

                          <strong>
                            ₹
                            {goal.targetAmount.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                      </div>

                      {/* PROGRESS */}

                      <div className="goal-progress">

                        <div className="goal-progress-track">

                          <div
                            className="goal-progress-fill"
                            style={{
                              width: `${cappedProgress}%`,
                            }}
                          />

                        </div>

                        <div className="goal-progress-info">

                          <span>
                            {progress.toFixed(
                              0
                            )}% complete
                          </span>

                          <span>
                            {remaining > 0
                              ? `₹${remaining.toLocaleString(
                                  "en-IN"
                                )} remaining`
                              : "Goal completed 🎉"}
                          </span>

                        </div>

                      </div>

                      {/* DATE */}

                      <div className="goal-date">

                        <CalendarDays size={15} />

                        <span>
                          Target date:{" "}
                          {formatDate(
                            goal.targetDate
                          )}
                        </span>

                      </div>

                    </article>
                  );
                }
              )}

              {/* ADD GOAL CARD */}

              <button
                className="goal-add-card"
                onClick={
                  openAddGoalModal
                }
              >

                <div className="goal-add-icon">
                  <Plus size={24} />
                </div>

                <strong>
                  Add New Goal
                </strong>

                <span>
                  Start saving for something important
                </span>

              </button>

            </div>

          )}

        </section>

        {/* =================================================
            ADD GOAL MODAL
        ================================================= */}

        {showAddGoal && (

          <div
            className="goal-modal-overlay"
            onClick={
              closeAddGoalModal
            }
          >

            <div
              className="goal-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="goal-modal-header">

                <div>
                  <h2>
                    Add Goal
                  </h2>

                  <p>
                    Create a new savings goal.
                  </p>
                </div>

                <button
                  className="goal-modal-close"
                  onClick={
                    closeAddGoalModal
                  }
                >
                  ×
                </button>

              </div>

              {/* NAME */}

              <label>
                Goal Name
              </label>

              <input
                type="text"
                value={goalName}
                placeholder="e.g. New Laptop"
                onChange={(e) => {
                  setGoalName(
                    e.target.value
                  );
                  setGoalError("");
                }}
              />

              {/* CATEGORY */}

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(
                    e.target.value
                  );
                  setGoalError("");
                }}
              >

                <option
                  value=""
                  disabled
                >
                  Select category
                </option>

                <option value="emergency">
                  Emergency Fund
                </option>

                <option value="travel">
                  Travel
                </option>

                <option value="education">
                  Education
                </option>

                <option value="vehicle">
                  Vehicle
                </option>

                <option value="home">
                  Home
                </option>

                <option value="electronics">
                  Electronics
                </option>

                <option value="investment">
                  Investment
                </option>

                <option value="other">
                  Other
                </option>

              </select>

              {/* TARGET */}

              <label>
                Target Amount
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={targetAmount}
                placeholder="e.g. 80000"
                onChange={(e) => {
                  setTargetAmount(
                    e.target.value
                  );
                  setGoalError("");
                }}
              />

              {/* SAVED */}

              <label>
                Current Saved Amount
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={savedAmount}
                placeholder="e.g. 10000"
                onChange={(e) => {
                  setSavedAmount(
                    e.target.value
                  );
                  setGoalError("");
                }}
              />

              {/* DATE */}

              <label>
                Target Date
              </label>

              <input
                type="date"
                value={targetDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => {
                  setTargetDate(
                    e.target.value
                  );
                  setGoalError("");
                }}
              />

              {/* ERROR */}

              {goalError && (
                <p className="goal-form-error">
                  {goalError}
                </p>
              )}

              {/* BUTTONS */}

              <div className="goal-modal-buttons">

                <button
                  onClick={
                    closeAddGoalModal
                  }
                >
                  Cancel
                </button>

                <button
                  className="goal-primary-button"
                  onClick={
                    handleAddGoal
                  }
                >
                  Add Goal
                </button>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            EDIT GOAL MODAL
        ================================================= */}

        {editingGoal && (

          <div
            className="goal-modal-overlay"
            onClick={
              closeEditGoalModal
            }
          >

            <div
              className="goal-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="goal-modal-header">

                <div>
                  <h2>
                    Edit Goal
                  </h2>

                  <p>
                    Update your savings goal.
                  </p>
                </div>

                <button
                  className="goal-modal-close"
                  onClick={
                    closeEditGoalModal
                  }
                >
                  ×
                </button>

              </div>

              {/* NAME */}

              <label>
                Goal Name
              </label>

              <input
                type="text"
                value={
                  editingGoal.name
                }
                onChange={(e) => {
                  setEditingGoal({
                    ...editingGoal,
                    name:
                      e.target.value,
                  });

                  setEditError("");
                }}
              />

              {/* CATEGORY */}

              <label>
                Category
              </label>

              <select
                value={
                  editingGoal.category
                }
                onChange={(e) => {
                  setEditingGoal({
                    ...editingGoal,
                    category:
                      e.target.value,
                  });

                  setEditError("");
                }}
              >

                <option value="emergency">
                  Emergency Fund
                </option>

                <option value="travel">
                  Travel
                </option>

                <option value="education">
                  Education
                </option>

                <option value="vehicle">
                  Vehicle
                </option>

                <option value="home">
                  Home
                </option>

                <option value="electronics">
                  Electronics
                </option>

                <option value="investment">
                  Investment
                </option>

                <option value="other">
                  Other
                </option>

              </select>

              {/* TARGET */}

              <label>
                Target Amount
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={
                  editingGoal.targetAmount
                }
                onChange={(e) => {
                  setEditingGoal({
                    ...editingGoal,
                    targetAmount:
                      Number(
                        e.target.value
                      ),
                  });

                  setEditError("");
                }}
              />

              {/* SAVED */}

              <label>
                Current Saved Amount
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={
                  editingGoal.savedAmount
                }
                onChange={(e) => {
                  setEditingGoal({
                    ...editingGoal,
                    savedAmount:
                      Number(
                        e.target.value
                      ),
                  });

                  setEditError("");
                }}
              />

              {/* DATE */}

              <label>
                Target Date
              </label>

              <input
                type="date"
                value={
                  editingGoal.targetDate
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => {
                  setEditingGoal({
                    ...editingGoal,
                    targetDate:
                      e.target.value,
                  });

                  setEditError("");
                }}
              />

              {/* ERROR */}

              {editError && (
                <p className="goal-form-error">
                  {editError}
                </p>
              )}

              {/* BUTTONS */}

              <div className="goal-modal-buttons">

                <button
                  onClick={
                    closeEditGoalModal
                  }
                >
                  Cancel
                </button>

                <button
                  className="goal-primary-button"
                  onClick={
                    handleEditGoal
                  }
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            DELETE MODAL
        ================================================= */}

        {deletingGoal && (

          <div
            className="goal-modal-overlay"
            onClick={() =>
              setDeletingGoal(null)
            }
          >

            <div
              className="goal-modal delete-goal-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="delete-goal-icon">
                <Trash2 size={24} />
              </div>

              <div className="delete-goal-content">

                <h2>
                  Delete Goal?
                </h2>

                <p>
                  Are you sure you want to
                  delete the{" "}
                  <strong>
                    {deletingGoal.name}
                  </strong>{" "}
                  goal?
                </p>

                <span>
                  This action cannot be undone.
                </span>

              </div>

              <div className="goal-modal-buttons">

                <button
                  onClick={() =>
                    setDeletingGoal(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="delete-goal-confirm-button"
                  onClick={
                    confirmDeleteGoal
                  }
                >
                  <Trash2 size={16} />
                  Delete Goal
                </button>

              </div>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}

export default Goals;