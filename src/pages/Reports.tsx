import { useState } from "react";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "./Reports.css";


interface Transaction {
  id: number;

  type: "income" | "expense";

  category: string;

  description: string;

  amount: number;

  date: string;

  accountName: string;
}


function Reports() {

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigate =
    useNavigate();


  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const [transactions] =
    useState<Transaction[]>(
      () => {

        const savedTransactions =
          localStorage.getItem(
            "spendwise_transactions"
          );

        return savedTransactions
          ? JSON.parse(
              savedTransactions
            )
          : [];

      }
    );


  // =========================================================
  // TOTAL INCOME
  // =========================================================

  const totalIncome =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          transaction.amount,
        0
      );


  // =========================================================
  // TOTAL EXPENSES
  // =========================================================

  const totalExpenses =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          transaction.amount,
        0
      );


  // =========================================================
  // NET SAVINGS
  // =========================================================

  const netSavings =
    totalIncome -
    totalExpenses;


  // =========================================================
  // TOTAL TRANSACTIONS
  // =========================================================

  const totalTransactions =
    transactions.length;


  // =========================================================
  // SPENDING BY CATEGORY
  // =========================================================

  const categorySpending =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (
          categories:
            Record<string, number>,
          transaction
        ) => {

          const category =
            transaction.category ||
            "Other";


          categories[
            category
          ] =
            (
              categories[
                category
              ] || 0
            ) +
            transaction.amount;


          return categories;

        },
        {}
      );


  const categoryReport =
    Object.entries(
      categorySpending
    )
      .map(
        (
          [
            category,
            amount
          ]
        ) => ({

          category,

          amount,

          percentage:
            totalExpenses > 0
              ? Math.round(
                  (
                    amount /
                    totalExpenses
                  ) * 100
                )
              : 0,

        })
      )
      .sort(
        (a, b) =>
          b.amount -
          a.amount
      );


  // =========================================================
  // YEARLY REPORTS
  // =========================================================

  const currentYear =
    new Date()
      .getFullYear();


  const yearlyReports =
    transactions.reduce(
      (
        years:
          Record<
            number,
            {
              totalExpenses: number;
              transactionCount: number;
            }
          >,
        transaction
      ) => {

        const date =
          new Date(
            transaction.date
          );


        const year =
          date.getFullYear();


        // Ignore invalid dates
        if (
          Number.isNaN(
            year
          )
        ) {

          return years;

        }


        // Create year if it does not exist
        if (
          !years[year]
        ) {

          years[year] = {

            totalExpenses: 0,

            transactionCount: 0,

          };

        }


        // Count all transactions
        years[
          year
        ].transactionCount +=
          1;


        // Add only expenses
        if (
          transaction.type ===
          "expense"
        ) {

          years[
            year
          ].totalExpenses +=
            transaction.amount;

        }


        return years;

      },
      {}
    );


  // =========================================================
  // ALWAYS SHOW CURRENT YEAR
  // =========================================================

  if (
    !yearlyReports[
      currentYear
    ]
  ) {

    yearlyReports[
      currentYear
    ] = {

      totalExpenses: 0,

      transactionCount: 0,

    };

  }


  // =========================================================
  // CONVERT YEAR DATA TO ARRAY
  // =========================================================

  const yearReportList =
    Object.entries(
      yearlyReports
    )
      .map(
        (
          [
            year,
            data
          ]
        ) => ({

          year:
            Number(
              year
            ),

          totalExpenses:
            data.totalExpenses,

          transactionCount:
            data.transactionCount,

        })
      )
      .sort(
        (a, b) =>
          b.year -
          a.year
      );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <main
      className="reports-page"
    >

      <Sidebar />


      <section
        className="reports-main"
      >


        {/* ===============================================
            HEADER
        =============================================== */}

        <div
          className="reports-header"
        >

          <div>

            <h1>
              Reports
            </h1>


            <p>
              Analyze your income,
              expenses, and spending
              patterns.
            </p>

          </div>

        </div>


        {/* ===============================================
            SUMMARY CARDS
        =============================================== */}

        <section
          className="reports-summary"
        >


          {/* TOTAL INCOME */}

          <article
            className="report-summary-card"
          >

            <div
              className="
                report-summary-icon
                income
              "
            >

              <TrendingUp
                size={20}
              />

            </div>


            <span>
              Total Income
            </span>


            <strong>

              ₹
              {totalIncome.toLocaleString(
                "en-IN"
              )}

            </strong>


            <small>
              Money earned
            </small>

          </article>


          {/* TOTAL EXPENSES */}

          <article
            className="report-summary-card"
          >

            <div
              className="
                report-summary-icon
                expense
              "
            >

              <TrendingDown
                size={20}
              />

            </div>


            <span>
              Total Expenses
            </span>


            <strong>

              ₹
              {totalExpenses.toLocaleString(
                "en-IN"
              )}

            </strong>


            <small>
              Money spent
            </small>

          </article>


          {/* NET SAVINGS */}

          <article
            className="report-summary-card"
          >

            <div
              className="
                report-summary-icon
                savings
              "
            >

              <Wallet
                size={20}
              />

            </div>


            <span>
              Net Savings
            </span>


            <strong
              className={
                netSavings >= 0
                  ? "report-positive"
                  : "report-negative"
              }
            >

              ₹
              {netSavings.toLocaleString(
                "en-IN"
              )}

            </strong>


            <small>
              Income minus expenses
            </small>

          </article>


          {/* TOTAL TRANSACTIONS */}

          <article
            className="report-summary-card"
          >

            <div
              className="
                report-summary-icon
                transactions
              "
            >

              <BarChart3
                size={20}
              />

            </div>


            <span>
              Total Transactions
            </span>


            <strong>

              {totalTransactions}

            </strong>


            <small>
              Recorded transactions
            </small>

          </article>

        </section>


        {/* ===============================================
            SPENDING BY CATEGORY
        =============================================== */}

        <section
          className="reports-category-section"
        >

          <div
            className="reports-section-header"
          >

            <div>

              <h2>
                Spending by Category
              </h2>


              <p>
                See where most of your
                money goes
              </p>

            </div>

          </div>


          {categoryReport.length === 0 ? (

            <div
              className="reports-empty-state"
            >

              <h3>
                No expense data yet
              </h3>


              <p>
                Add expense transactions
                to see your spending
                by category.
              </p>

            </div>

          ) : (

            <div
              className="category-report-list"
            >

              {categoryReport.map(
                (item) => (

                  <div
                    className="
                      category-report-item
                    "
                    key={
                      item.category
                    }
                  >

                    <div
                      className="
                        category-report-top
                      "
                    >

                      <div
                        className="
                          category-report-name
                        "
                      >

                        {item.category}

                      </div>


                      <div
                        className="
                          category-report-values
                        "
                      >

                        <strong>

                          ₹
                          {item.amount.toLocaleString(
                            "en-IN"
                          )}

                        </strong>


                        <span>

                          {item.percentage}%

                        </span>

                      </div>

                    </div>


                    <div
                      className="
                        category-progress-track
                      "
                    >

                      <div
                        className="
                          category-progress-fill
                        "
                        style={{
                          width:
                            `${item.percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ===============================================
            MONTHLY REPORTS BY YEAR
        =============================================== */}

        <section
          className="reports-years-section"
        >

          <div
            className="reports-section-header"
          >

            <div>

              <h2>
                Monthly Reports
              </h2>


              <p>
                Select a year to view
                month-by-month spending
                from January to December.
              </p>

            </div>

          </div>


          <div
            className="year-report-grid"
          >

            {yearReportList.map(
              (item) => (

                <button
                  key={
                    item.year
                  }
                  className="
                    year-report-card
                  "
                  onClick={() =>
                    navigate(
                      `/reports/${item.year}`
                    )
                  }
                >


                  {/* TOP */}

                  <div
                    className="
                      year-report-card-top
                    "
                  >

                    <div
                      className="
                        year-report-icon
                      "
                    >

                      <CalendarDays
                        size={22}
                      />

                    </div>


                    <ArrowRight
                      className="
                        year-report-arrow
                      "
                      size={20}
                    />

                  </div>


                  {/* YEAR */}

                  <h3>

                    {item.year}

                  </h3>


                  {/* INFORMATION */}

                  <div
                    className="
                      year-report-info
                    "
                  >

                    <div>

                      <span>
                        Total Spent
                      </span>


                      <strong>

                        ₹
                        {item.totalExpenses.toLocaleString(
                          "en-IN"
                        )}

                      </strong>

                    </div>


                    <div>

                      <span>
                        Transactions
                      </span>


                      <strong>

                        {item.transactionCount}

                      </strong>

                    </div>

                  </div>


                  {/* BUTTON TEXT */}

                  <div
                    className="
                      year-report-view
                    "
                  >

                    View Monthly Report


                    <ArrowRight
                      size={16}
                    />

                  </div>

                </button>

              )
            )}

          </div>

        </section>


      </section>

    </main>

  );

}


export default Reports;