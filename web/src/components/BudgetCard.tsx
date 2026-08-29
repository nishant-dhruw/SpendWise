import { MoreHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

import "./BudgetCard.css";

interface Budget {
  id: number;
  category: string;
  limit: number;
}

interface BudgetCardProps {
  totalExpenses: number;
}

function BudgetCard({
  totalExpenses,
}: BudgetCardProps) {

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
  // MODAL
  // =========================================================

  const [showBudgetModal, setShowBudgetModal] =
    useState(false);


  const [budgetInput, setBudgetInput] =
    useState(
      String(monthlyBudget)
    );


  const [budgetError, setBudgetError] =
    useState("");


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

        const parsedBudget =
          Number(savedBudget);

        if (
          Number.isFinite(parsedBudget) &&
          parsedBudget > 0
        ) {

          setMonthlyBudget(
            parsedBudget
          );

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
  // CALCULATIONS
  // =========================================================

  const percentageUsed =
    monthlyBudget > 0
      ? (totalExpenses /
          monthlyBudget) *
        100
      : 0;


  const progressPercentage =
    Math.min(
      percentageUsed,
      100
    );


  const remainingAmount =
    monthlyBudget -
    totalExpenses;


  // =========================================================
  // OPEN MODAL
  // =========================================================

  const handleOpenBudgetModal = () => {

    setBudgetInput(
      String(monthlyBudget)
    );

    setBudgetError("");

    setShowBudgetModal(true);

  };


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseBudgetModal = () => {

    setShowBudgetModal(false);

    setBudgetError("");

  };


  // =========================================================
  // SAVE MASTER MONTHLY BUDGET
  // =========================================================

  const handleSaveBudget = () => {

    const trimmedInput =
      budgetInput.trim();


    // =======================================================
    // EMPTY VALIDATION
    // =======================================================

    if (!trimmedInput) {

      setBudgetError(
        "Please enter a monthly budget."
      );

      return;

    }


    // =======================================================
    // CONVERT INPUT TO NUMBER
    // =======================================================

    const newBudget =
      Number(trimmedInput);


    // =======================================================
    // INVALID / ZERO / NEGATIVE
    // =======================================================

    if (
      !Number.isFinite(newBudget) ||
      newBudget <= 0
    ) {

      setBudgetError(
        "Monthly budget must be greater than ₹0."
      );

      return;

    }


    // =======================================================
    // LOAD CATEGORY BUDGETS
    // =======================================================

    const savedBudgets =
      localStorage.getItem(
        "spendwise_budgets"
      );


    let categoryBudgets: Budget[] = [];


    if (savedBudgets) {

      try {

        const parsedBudgets =
          JSON.parse(savedBudgets);

        if (
          Array.isArray(parsedBudgets)
        ) {

          categoryBudgets =
            parsedBudgets;

        }

      } catch {

        categoryBudgets = [];

      }

    }


    // =======================================================
    // CALCULATE TOTAL ALLOCATED CATEGORY BUDGET
    // =======================================================

    const allocatedAmount =
      categoryBudgets.reduce(
        (total, budget) => {

          const limit =
            Number(budget.limit);

          return (
            total +
            (
              Number.isFinite(limit)
                ? limit
                : 0
            )
          );

        },
        0
      );


    // =======================================================
    // MASTER BUDGET CANNOT BE LESS THAN ALLOCATION
    // =======================================================

    if (
      newBudget <
      allocatedAmount
    ) {

      setBudgetError(
        `Monthly budget cannot be less than your allocated category budgets of ₹${allocatedAmount.toLocaleString(
          "en-IN"
        )}.`
      );

      return;

    }


    // =======================================================
    // SAVE MASTER BUDGET
    // =======================================================

    setMonthlyBudget(
      newBudget
    );


    localStorage.setItem(
      "spendwise_monthly_budget",
      String(newBudget)
    );


    setBudgetError("");

    setShowBudgetModal(false);

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>

      {/* =================================================
          BUDGET CARD
      ================================================= */}

      <article className="budget-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="budget-card-header">

          <div>

            <h3>
              Monthly Budget
            </h3>

            <p>
              Your overall monthly spending limit
            </p>

          </div>


          <button
            className="budget-menu-button"
            onClick={
              handleOpenBudgetModal
            }
            aria-label="Edit monthly budget"
            title="Edit monthly budget"
          >

            <MoreHorizontal
              size={19}
            />

          </button>

        </div>


        {/* =================================================
            AMOUNT
        ================================================= */}

        <div className="budget-total">

          <strong>
            ₹
            {totalExpenses.toLocaleString(
              "en-IN"
            )}
          </strong>

          <span>
            of ₹
            {monthlyBudget.toLocaleString(
              "en-IN"
            )}
          </span>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="budget-progress">

          <div
            className="budget-progress-fill"
            style={{
              width:
                `${progressPercentage}%`,
            }}
          />

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="budget-footer">

          <span>
            {Math.round(
              percentageUsed
            )}% used
          </span>


          <strong
            className={
              remainingAmount < 0
                ? "budget-over"
                : ""
            }
          >

            ₹
            {Math.max(
              remainingAmount,
              0
            ).toLocaleString(
              "en-IN"
            )}{" "}

            {remainingAmount >= 0
              ? "left"
              : "over"}

          </strong>

        </div>


        {/* =================================================
            WARNING - APPROACHING LIMIT
        ================================================= */}

        {percentageUsed >= 80 &&
          percentageUsed < 100 && (

            <div className="budget-warning">

              You're approaching
              your monthly limit.

            </div>

        )}


        {/* =================================================
            WARNING - EXCEEDED
        ================================================= */}

        {percentageUsed >= 100 && (

          <div className="budget-warning">

            You've exceeded your
            monthly budget.

          </div>

        )}

      </article>


      {/* =================================================
          SET MONTHLY BUDGET MODAL
      ================================================= */}

      {showBudgetModal && (

        <div
          className="budget-modal-overlay"
          onClick={
            handleCloseBudgetModal
          }
        >

          <div
            className="budget-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="budget-modal-header">

              <div>

                <h2>
                  Set Monthly Budget
                </h2>

                <p>
                  Set your overall monthly spending limit.
                </p>

              </div>


              <button
                className="budget-modal-close"
                onClick={
                  handleCloseBudgetModal
                }
                aria-label="Close"
              >

                <X size={19} />

              </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <div className="budget-modal-form">

              <label>
                Monthly Budget
              </label>


              <div className="budget-input-wrapper">

                <span>
                  ₹
                </span>


                <input
                  type="number"
                  min="1"
                  step="1"
                  value={budgetInput}
                  onChange={(e) => {

                    setBudgetInput(
                      e.target.value
                    );

                    setBudgetError("");

                  }}
                  autoFocus
                />

              </div>


              {/* =================================================
                  ERROR
              ================================================= */}

              {budgetError && (

                <p className="budget-form-error">

                  {budgetError}

                </p>

              )}

            </div>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="budget-modal-actions">

              <button
                type="button"
                className="budget-cancel-button"
                onClick={
                  handleCloseBudgetModal
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="budget-save-button"
                onClick={
                  handleSaveBudget
                }
              >
                Save Budget
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default BudgetCard;