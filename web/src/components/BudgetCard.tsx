import { MoreHorizontal } from "lucide-react";

import "./BudgetCard.css";

function BudgetCard() {
  return (
    <article className="budget-card">

      {/* Header */}
      <div className="budget-card-header">

        <div>
          <h3>Monthly Budget</h3>

          <p>
            Your spending limit
          </p>
        </div>

        <button className="budget-menu-button">
          <MoreHorizontal size={19} />
        </button>

      </div>


      {/* Amount */}
      <div className="budget-total">

        <strong>
          ₹24,580
        </strong>

        <span>
          of ₹30,000
        </span>

      </div>


      {/* Progress */}
      <div className="budget-progress">

        <div
          className="budget-progress-fill"
          style={{ width: "82%" }}
        ></div>

      </div>


      {/* Footer */}
      <div className="budget-footer">

        <span>
          82% used
        </span>

        <strong>
          ₹5,420 left
        </strong>

      </div>


      {/* Warning */}
      <div className="budget-warning">
        You're approaching your monthly limit.
      </div>

    </article>
  );
}

export default BudgetCard;