import { BarChart3 } from "lucide-react";

import "./SpendingOverview.css";

function SpendingOverview() {
  return (
    <article className="spending-overview-card">

      {/* Header */}
      <div className="spending-overview-header">

        <div>
          <h3>Spending Overview</h3>
          <p>Your spending this month</p>
        </div>

        <select className="spending-period">
          <option>This month</option>
          <option>This week</option>
          <option>Last month</option>
          <option>Last 3 months</option>
          <option>This year</option>
        </select>

      </div>


      {/* Chart */}
      <div className="spending-chart">

        <div className="chart-y-axis">
          <span>₹50k</span>
          <span>₹40k</span>
          <span>₹30k</span>
          <span>₹20k</span>
          <span>₹10k</span>
          <span>₹0</span>
        </div>


        <div className="chart-area">

          <div className="chart-grid-lines">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>


          {/* Income line */}
          <svg
            className="chart-svg"
            viewBox="0 0 800 220"
            preserveAspectRatio="none"
          >
            <path
              d="M0 170
                 C80 135, 130 115, 200 105
                 C280 90, 330 82, 400 75
                 C480 68, 540 62, 600 54
                 C670 45, 730 40, 800 58"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
            />

            {/* Expense line */}
            <path
              d="M0 130
                 C80 125, 140 130, 200 130
                 C280 132, 340 140, 400 145
                 C480 150, 540 160, 600 170
                 C680 180, 740 192, 800 205"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
            />
          </svg>


          <div className="chart-months">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>

        </div>

      </div>


      {/* Legend */}
      <div className="chart-legend">

        <span>
          <i className="legend-income"></i>
          Income
        </span>

        <span>
          <i className="legend-expense"></i>
          Expenses
        </span>

      </div>

    </article>
  );
}

export default SpendingOverview;