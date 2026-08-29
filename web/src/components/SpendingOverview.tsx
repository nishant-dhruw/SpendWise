import { useState } from "react";
import "./SpendingOverview.css";

interface Transaction {
  id: number;
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

  const getTransactionDate = (dateString: string) => {

    const parsedDate = new Date(dateString);

    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

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

    return null;
  };


  // =====================================================
  // FILTER TRANSACTIONS
  // =====================================================

  const filteredTransactions =
    transactions.filter((transaction) => {

      const transactionDate =
        getTransactionDate(transaction.date);

      if (!transactionDate) {
        return false;
      }

      const currentYear =
        now.getFullYear();

      const currentMonth =
        now.getMonth();


      // ================= THIS MONTH =================

      if (selectedPeriod === "This month") {

        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );

      }


      // ================= THIS WEEK =================

      if (selectedPeriod === "This week") {

        const startOfWeek = new Date(now);

        const day =
          startOfWeek.getDay();

        const difference =
          day === 0 ? -6 : 1 - day;

        startOfWeek.setDate(
          startOfWeek.getDate() + difference
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
          endOfWeek.getDate() + 7
        );


        return (
          transactionDate >= startOfWeek &&
          transactionDate < endOfWeek
        );

      }


      // ================= LAST MONTH =================

      if (selectedPeriod === "Last month") {

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


      // ================= LAST 3 MONTHS =================

      if (selectedPeriod === "Last 3 months") {

        const threeMonthsAgo =
          new Date(now);

        threeMonthsAgo.setMonth(
          now.getMonth() - 3
        );

        threeMonthsAgo.setHours(
          0,
          0,
          0,
          0
        );

        return (
          transactionDate >= threeMonthsAgo &&
          transactionDate <= now
        );

      }


      // ================= THIS YEAR =================

      if (selectedPeriod === "This year") {

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
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );


  // =====================================================
  // TOTAL EXPENSE
  // =====================================================

  const totalExpenses =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );


  // =====================================================
  // CREATE CHART DATA
  // =====================================================

  const createChartData = (): ChartPoint[] => {

    // ===================================================
    // THIS WEEK
    // ===================================================

    if (selectedPeriod === "This week") {

      const days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ];


      return days.map((day, index) => {

        let income = 0;
        let expense = 0;


        filteredTransactions.forEach(
          (transaction) => {

            const date =
              getTransactionDate(
                transaction.date
              );

            if (!date) return;


            const dayOfWeek =
              date.getDay();

            const convertedDay =
              dayOfWeek === 0
                ? 6
                : dayOfWeek - 1;


            if (
              convertedDay === index
            ) {

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

          }
        );


        return {
          label: day,
          income,
          expense,
        };

      });

    }


    // ===================================================
    // THIS MONTH
    // ===================================================

    if (
      selectedPeriod === "This month" ||
      selectedPeriod === "Last month"
    ) {

      const year =
        selectedPeriod === "This month"
          ? now.getFullYear()
          : now.getMonth() === 0
            ? now.getFullYear() - 1
            : now.getFullYear();


      const month =
        selectedPeriod === "This month"
          ? now.getMonth()
          : now.getMonth() === 0
            ? 11
            : now.getMonth() - 1;


      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      const numberOfWeeks =
        Math.ceil(daysInMonth / 7);


      const weeks: ChartPoint[] = [];


      for (
        let week = 0;
        week < numberOfWeeks;
        week++
      ) {

        let income = 0;
        let expense = 0;


        filteredTransactions.forEach(
          (transaction) => {

            const date =
              getTransactionDate(
                transaction.date
              );

            if (!date) return;


            if (
              date.getFullYear() !== year ||
              date.getMonth() !== month
            ) {
              return;
            }


            const weekNumber =
              Math.floor(
                (date.getDate() - 1) / 7
              );


            if (weekNumber === week) {

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

          }
        );


        weeks.push({
          label: `Week ${week + 1}`,
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

      const result: ChartPoint[] = [];


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

            if (!transactionDate) return;


            if (
              transactionDate.getMonth() ===
                month &&
              transactionDate.getFullYear() ===
                year
            ) {

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

          }
        );


        result.push({
          label:
            date.toLocaleString(
              "en-IN",
              { month: "short" }
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
      selectedPeriod === "This year"
    ) {

      const result: ChartPoint[] = [];


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

            if (!date) return;


            if (
              date.getMonth() === month &&
              date.getFullYear() ===
                now.getFullYear()
            ) {

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
              { month: "short" }
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


  // Find maximum value

  const maxValue = Math.max(
    ...chartData.map(
      (point) =>
        Math.max(
          point.income,
          point.expense
        )
    ),
    0
  );


  // Make the graph scale nicely

  const chartMax =
    maxValue === 0
      ? 1000
      : Math.ceil(
          maxValue * 1.2 / 1000
        ) * 1000;


  // =====================================================
  // CONVERT DATA TO SVG POINTS
  // =====================================================

  const getX = (index: number) => {

    if (chartData.length === 1) {
      return chartWidth / 2;
    }

    return (
      paddingLeft +
      (index /
        (chartData.length - 1)) *
        (chartWidth -
          paddingLeft -
          paddingRight)
    );

  };


  const getY = (value: number) => {

    return (
      paddingTop +
      (1 -
        value / chartMax) *
        (chartHeight -
          paddingTop -
          paddingBottom)
    );

  };


  const incomePoints =
    chartData
      .map(
        (point, index) =>
          `${getX(index)},${getY(
            point.income
          )}`
      )
      .join(" ");


  const expensePoints =
    chartData
      .map(
        (point, index) =>
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

    if (value >= 100000) {
      return `₹${(
        value / 100000
      ).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${(
        value / 1000
      ).toFixed(0)}k`;
    }

    return `₹${Math.round(value)}`;

  };


  return (
    <article className="spending-overview-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="spending-overview-header">

        <div>

          <h3>
            Spending Overview
          </h3>

          <p>
            Income and expenses for{" "}
            {selectedPeriod.toLowerCase()}
          </p>

          <div className="spending-summary">

            <span className="summary-income">
              Income:{" "}
              <strong>
                ₹{totalIncome.toLocaleString("en-IN")}
              </strong>
            </span>

            <span className="summary-expense">
              Expenses:{" "}
              <strong>
                ₹{totalExpenses.toLocaleString("en-IN")}
              </strong>
            </span>

          </div>

        </div>


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

      <div className="spending-chart">

        <div className="chart-y-axis">

          {yAxisValues.map(
            (value, index) => (

              <span key={index}>
                {formatAmount(value)}
              </span>

            )
          )}

        </div>


        <div className="chart-area">

          <div className="chart-grid-lines">

            {yAxisValues.map(
              (_, index) => (
                <span
                  key={index}
                />
              )
            )}

          </div>


          <svg
            className="chart-svg"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >

            {/* Income */}

            <polyline
              points={incomePoints}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {/* Expenses */}

            <polyline
              points={expensePoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {/* Income dots */}

            {chartData.map(
              (point, index) => (

                <circle
                  key={`income-${index}`}
                  cx={getX(index)}
                  cy={getY(point.income)}
                  r="4"
                  fill="#10b981"
                />

              )
            )}


            {/* Expense dots */}

            {chartData.map(
              (point, index) => (

                <circle
                  key={`expense-${index}`}
                  cx={getX(index)}
                  cy={getY(point.expense)}
                  r="4"
                  fill="#f59e0b"
                />

              )
            )}

          </svg>


          {/* X Axis */}

          <div className="chart-months">

            {chartData.map(
              (point, index) => (

                <span
                  key={index}
                >
                  {point.label}
                </span>

              )
            )}

          </div>


          {/* Empty state */}

          {filteredTransactions.length ===
            0 && (

            <div className="chart-empty-state">

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