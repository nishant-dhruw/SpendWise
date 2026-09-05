import { useState } from "react";
import "./SpendingOverview.css";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  accountName: string;
}

interface SpendingOverviewProps {
  transactions: Transaction[];
}

interface ChartPoint {
  label: string;
  income: number;
  expense: number;
}

function SpendingOverview({
  transactions,
}: SpendingOverviewProps) {

  const [selectedPeriod, setSelectedPeriod] =
    useState("This month");

  const now = new Date();

  // =====================================================
  // CONVERT TRANSACTION DATE
  // =====================================================

  const getTransactionDate = (
    dateString: string
  ) => {

    if (!dateString) {
      return null;
    }

    // Backend sends YYYY-MM-DD
    // Create local date to avoid timezone problems.
    const dateOnly = dateString.split("T")[0];

    const parts = dateOnly.split("-");

    if (parts.length === 3) {

      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);

      const localDate = new Date(
        year,
        month,
        day
      );

      if (!isNaN(localDate.getTime())) {
        return localDate;
      }

    }

    // Support older local-storage style dates
    if (dateString.startsWith("Today")) {
      return new Date();
    }

    if (dateString.startsWith("Yesterday")) {

      const yesterday = new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      return yesterday;
    }

    const parsedDate =
      new Date(dateString);

    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    return null;
  };


  // =====================================================
  // FILTER TRANSACTIONS
  // =====================================================

  const filteredTransactions =
    transactions.filter((transaction) => {

      const transactionDate =
        getTransactionDate(
          transaction.date
        );

      if (!transactionDate) {
        return false;
      }

      const currentYear =
        now.getFullYear();

      const currentMonth =
        now.getMonth();


      // =================================================
      // THIS MONTH
      // =================================================

      if (selectedPeriod === "This month") {

        return (
          transactionDate.getMonth() ===
            currentMonth &&
          transactionDate.getFullYear() ===
            currentYear
        );

      }


      // =================================================
      // THIS WEEK
      // =================================================

      if (selectedPeriod === "This week") {

        const startOfWeek =
          new Date(now);

        const day =
          startOfWeek.getDay();

        const difference =
          day === 0
            ? -6
            : 1 - day;

        startOfWeek.setDate(
          startOfWeek.getDate() +
            difference
        );

        startOfWeek.setHours(
          0,
          0,
          0,
          0
        );


        const endOfWeek =
          new Date(startOfWeek);

        endOfWeek.setDate(
          endOfWeek.getDate() +
            7
        );


        return (
          transactionDate >=
            startOfWeek &&
          transactionDate <
            endOfWeek
        );

      }


      // =================================================
      // LAST MONTH
      // =================================================

      if (
        selectedPeriod ===
        "Last month"
      ) {

        const lastMonth =
          new Date(
            currentYear,
            currentMonth - 1,
            1
          );

        return (
          transactionDate.getMonth() ===
            lastMonth.getMonth() &&
          transactionDate.getFullYear() ===
            lastMonth.getFullYear()
        );

      }


      // =================================================
      // LAST 3 MONTHS
      // =================================================

      if (
        selectedPeriod ===
        "Last 3 months"
      ) {

        const startDate =
          new Date(
            currentYear,
            currentMonth - 2,
            1
          );

        const endDate =
          new Date(
            currentYear,
            currentMonth + 1,
            1
          );

        return (
          transactionDate >=
            startDate &&
          transactionDate <
            endDate
        );

      }


      // =================================================
      // THIS YEAR
      // =================================================

      if (
        selectedPeriod ===
        "This year"
      ) {

        return (
          transactionDate.getFullYear() ===
          currentYear
        );

      }


      return false;

    });


  // =====================================================
  // TOTAL INCOME
  // =====================================================

  const totalIncome =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income"
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          transaction.amount,
        0
      );


  // =====================================================
  // TOTAL EXPENSES
  // =====================================================

  const totalExpenses =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          transaction.amount,
        0
      );


  // =====================================================
  // CREATE CHART DATA
  // =====================================================

  const createChartData = (): ChartPoint[] => {

    // ===================================================
    // THIS WEEK
    // ===================================================

    if (
      selectedPeriod ===
      "This week"
    ) {

      const days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ];


      return days.map(
        (
          day,
          index
        ) => {

          let income = 0;
          let expense = 0;


          filteredTransactions.forEach(
            (transaction) => {

              const date =
                getTransactionDate(
                  transaction.date
                );

              if (!date) {
                return;
              }


              const dayOfWeek =
                date.getDay();

              const convertedDay =
                dayOfWeek === 0
                  ? 6
                  : dayOfWeek - 1;


              if (
                convertedDay !==
                index
              ) {
                return;
              }


              if (
                transaction.type ===
                "income"
              ) {

                income +=
                  transaction.amount;

              }


              if (
                transaction.type ===
                "expense"
              ) {

                expense +=
                  transaction.amount;

              }

            }
          );


          return {
            label: day,
            income,
            expense,
          };

        }
      );

    }


    // ===================================================
    // THIS MONTH
    // ===================================================

    if (
      selectedPeriod ===
        "This month" ||
      selectedPeriod ===
        "Last month"
    ) {

      const targetDate =
        selectedPeriod ===
        "This month"
          ? new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            )
          : new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              1
            );


      const year =
        targetDate.getFullYear();

      const month =
        targetDate.getMonth();


      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      const numberOfWeeks =
        Math.ceil(
          daysInMonth / 7
        );


      const weeks: ChartPoint[] =
        [];


      for (
        let week = 0;
        week < numberOfWeeks;
        week++
      ) {

        let income = 0;
        let expense = 0;


        const startDay =
          week * 7 + 1;

        const endDay =
          Math.min(
            startDay + 6,
            daysInMonth
          );


        filteredTransactions.forEach(
          (transaction) => {

            const date =
              getTransactionDate(
                transaction.date
              );

            if (!date) {
              return;
            }


            if (
              date.getFullYear() !==
                year ||
              date.getMonth() !==
                month
            ) {

              return;

            }


            const day =
              date.getDate();


            if (
              day < startDay ||
              day > endDay
            ) {

              return;

            }


            if (
              transaction.type ===
              "income"
            ) {

              income +=
                transaction.amount;

            }


            if (
              transaction.type ===
              "expense"
            ) {

              expense +=
                transaction.amount;

            }

          }
        );


        weeks.push({

          label:
            `Week ${week + 1}`,

          income,

          expense,

        });

      }


      return weeks;

    }


    // ===================================================
    // LAST 3 MONTHS
    // ===================================================

    if (
      selectedPeriod ===
      "Last 3 months"
    ) {

      const result:
        ChartPoint[] = [];


      for (
        let i = 2;
        i >= 0;
        i--
      ) {

        const date =
          new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
          );


        const month =
          date.getMonth();

        const year =
          date.getFullYear();


        let income = 0;
        let expense = 0;


        filteredTransactions.forEach(
          (transaction) => {

            const transactionDate =
              getTransactionDate(
                transaction.date
              );

            if (!transactionDate) {
              return;
            }


            if (
              transactionDate.getMonth() !==
                month ||
              transactionDate.getFullYear() !==
                year
            ) {

              return;

            }


            if (
              transaction.type ===
              "income"
            ) {

              income +=
                transaction.amount;

            }


            if (
              transaction.type ===
              "expense"
            ) {

              expense +=
                transaction.amount;

            }

          }
        );


        result.push({

          label:
            date.toLocaleString(
              "en-IN",
              {
                month: "short",
              }
            ),

          income,

          expense,

        });

      }


      return result;

    }


    // ===================================================
    // THIS YEAR
    // ===================================================

    if (
      selectedPeriod ===
      "This year"
    ) {

      const result:
        ChartPoint[] = [];


      for (
        let month = 0;
        month < 12;
        month++
      ) {

        let income = 0;
        let expense = 0;


        filteredTransactions.forEach(
          (transaction) => {

            const date =
              getTransactionDate(
                transaction.date
              );

            if (!date) {
              return;
            }


            if (
              date.getMonth() !==
                month ||
              date.getFullYear() !==
                now.getFullYear()
            ) {

              return;

            }


            if (
              transaction.type ===
              "income"
            ) {

              income +=
                transaction.amount;

            }


            if (
              transaction.type ===
              "expense"
            ) {

              expense +=
                transaction.amount;

            }

          }
        );


        result.push({

          label:
            new Date(
              now.getFullYear(),
              month,
              1
            ).toLocaleString(
              "en-IN",
              {
                month: "short",
              }
            ),

          income,

          expense,

        });

      }


      return result;

    }


    return [];

  };


  const chartData =
    createChartData();


  // =====================================================
  // CHART DIMENSIONS
  // =====================================================

  const chartWidth = 800;
  const chartHeight = 260;

  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 20;


  // =====================================================
  // FIND MAXIMUM VALUE
  // =====================================================

  const maxValue =
    Math.max(
      ...chartData.map(
        (point) =>
          Math.max(
            point.income,
            point.expense
          )
      ),
      0
    );


  // =====================================================
  // GRAPH SCALE
  // =====================================================

  const chartMax =
    maxValue === 0
      ? 1000
      : Math.ceil(
          (maxValue * 1.2) /
            1000
        ) * 1000;


  // =====================================================
  // CONVERT DATA TO SVG POINTS
  // =====================================================

  const getX = (
    index: number
  ) => {

    if (
      chartData.length === 1
    ) {

      return chartWidth / 2;

    }


    return (
      paddingLeft +
      (index /
        (chartData.length - 1)) *
        (
          chartWidth -
          paddingLeft -
          paddingRight
        )
    );

  };


  const getY = (
    value: number
  ) => {

    return (
      paddingTop +
      (
        1 -
        value / chartMax
      ) *
        (
          chartHeight -
          paddingTop -
          paddingBottom
        )
    );

  };


  const incomePoints =
    chartData
      .map(
        (
          point,
          index
        ) =>
          `${getX(index)},${getY(
            point.income
          )}`
      )
      .join(" ");


  const expensePoints =
    chartData
      .map(
        (
          point,
          index
        ) =>
          `${getX(index)},${getY(
            point.expense
          )}`
      )
      .join(" ");


  // =====================================================
  // Y AXIS
  // =====================================================

  const yAxisValues = [
    chartMax,
    chartMax * 0.75,
    chartMax * 0.5,
    chartMax * 0.25,
    0,
  ];


  const formatAmount = (
    value: number
  ) => {

    if (
      value >= 100000
    ) {

      return `₹${(
        value / 100000
      ).toFixed(1)}L`;

    }


    if (
      value >= 1000
    ) {

      return `₹${(
        value / 1000
      ).toFixed(0)}k`;

    }


    return `₹${Math.round(
      value
    )}`;

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <article
      className="spending-overview-card"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="spending-overview-header"
      >

        <div>

          <h3>
            Spending Overview
          </h3>


          <p>
            Income and expenses for{" "}
            {selectedPeriod.toLowerCase()}
          </p>


          <div
            className="spending-summary"
          >

            <span
              className="summary-income"
            >

              Income:{" "}

              <strong>
                ₹
                {totalIncome.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </span>


            <span
              className="summary-expense"
            >

              Expenses:{" "}

              <strong>
                ₹
                {totalExpenses.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </span>

          </div>

        </div>


        {/* =================================================
            PERIOD SELECTOR
        ================================================= */}

        <select
          className="spending-period"
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(
              e.target.value
            )
          }
        >

          <option>
            This month
          </option>

          <option>
            This week
          </option>

          <option>
            Last month
          </option>

          <option>
            Last 3 months
          </option>

          <option>
            This year
          </option>

        </select>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div
        className="spending-chart"
      >

        {/* =================================================
            Y AXIS
        ================================================= */}

        <div
          className="chart-y-axis"
        >

          {yAxisValues.map(
            (
              value,
              index
            ) => (

              <span
                key={index}
              >
                {formatAmount(
                  value
                )}
              </span>

            )
          )}

        </div>


        {/* =================================================
            CHART AREA
        ================================================= */}

        <div
          className="chart-area"
        >

          {/* =================================================
              GRID
          ================================================= */}

          <div
            className="chart-grid-lines"
          >

            {yAxisValues.map(
              (
                _,
                index
              ) => (

                <span
                  key={index}
                />

              )
            )}

          </div>


          {/* =================================================
              SVG
          ================================================= */}

          <svg
            className="chart-svg"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >

            {/* =============================================
                INCOME LINE
            ============================================= */}

            <polyline
              points={
                incomePoints
              }
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {/* =============================================
                EXPENSE LINE
            ============================================= */}

            <polyline
              points={
                expensePoints
              }
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {/* =============================================
                INCOME DOTS
            ============================================= */}

            {chartData.map(
              (
                point,
                index
              ) => (

                <circle
                  key={`income-${index}`}
                  cx={getX(index)}
                  cy={getY(
                    point.income
                  )}
                  r="4"
                  fill="#10b981"
                />

              )
            )}


            {/* =============================================
                EXPENSE DOTS
            ============================================= */}

            {chartData.map(
              (
                point,
                index
              ) => (

                <circle
                  key={`expense-${index}`}
                  cx={getX(index)}
                  cy={getY(
                    point.expense
                  )}
                  r="4"
                  fill="#f59e0b"
                />

              )
            )}

          </svg>


          {/* =================================================
              X AXIS
          ================================================= */}

          <div
            className="chart-months"
          >

            {chartData.map(
              (
                point,
                index
              ) => (

                <span
                  key={index}
                >
                  {point.label}
                </span>

              )
            )}

          </div>


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredTransactions.length ===
            0 && (

            <div
              className="chart-empty-state"
            >

              <span>
                No transactions for this period
              </span>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          LEGEND
      ================================================= */}

      <div
        className="chart-legend"
      >

        <span>

          <i
            className="legend-income"
          />

          Income

        </span>


        <span>

          <i
            className="legend-expense"
          />

          Expenses

        </span>

      </div>

    </article>

  );

}

export default SpendingOverview;