import { useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  TrendingDown,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "./YearReport.css";


interface Transaction {

  id: number;

  type: "income" | "expense";

  category: string;

  description: string;

  amount: number;

  date: string;

  accountName: string;

}


function YearReport() {

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigate =
    useNavigate();


  // =========================================================
  // GET YEAR FROM URL
  // =========================================================

  const { year } =
    useParams();


  const selectedYear =
    Number(year);


  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const [transactions] =
    useState<Transaction[]>(() => {

      const savedTransactions =
        localStorage.getItem(
          "spendwise_transactions"
        );


      return savedTransactions
        ? JSON.parse(savedTransactions)
        : [];

    });


  // =========================================================
  // MONTHS
  // =========================================================

  const months = [

    "January",

    "February",

    "March",

    "April",

    "May",

    "June",

    "July",

    "August",

    "September",

    "October",

    "November",

    "December",

  ];


  // =========================================================
  // MONTHLY EXPENSE DATA
  // =========================================================

  const monthlyData =
    months.map(
      (
        month,
        monthIndex
      ) => {

        const monthTransactions =
          transactions.filter(
            (
              transaction
            ) => {

              const date =
                new Date(
                  transaction.date
                );


              return (

                transaction.type ===
                  "expense" &&

                date.getFullYear() ===
                  selectedYear &&

                date.getMonth() ===
                  monthIndex

              );

            }
          );


        const totalExpenses =
          monthTransactions.reduce(
            (
              total,
              transaction
            ) =>
              total +
              transaction.amount,
            0
          );


        return {

          month,

          totalExpenses,

          transactionCount:
            monthTransactions.length,

        };

      }
    );


  // =========================================================
  // HIGHEST MONTHLY SPENDING
  // =========================================================

  const highestMonthlySpending =
    Math.max(
      ...monthlyData.map(
        (
          item
        ) =>
          item.totalExpenses
      ),
      0
    );


  // =========================================================
  // YEAR TOTAL
  // =========================================================

  const yearTotal =
    monthlyData.reduce(
      (
        total,
        item
      ) =>
        total +
        item.totalExpenses,
      0
    );


  const yearTransactions =
    monthlyData.reduce(
      (
        total,
        item
      ) =>
        total +
        item.transactionCount,
      0
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <main className="year-report-page">

      <Sidebar />


      <section className="year-report-main">


        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="year-report-header">


          <button
            className="back-to-reports"
            onClick={() =>
              navigate(
                "/reports"
              )
            }
          >

            <ArrowLeft
              size={20}
            />

            Back to Reports

          </button>


          <div>

            <h1>

              {selectedYear}
              {" "}
              Monthly Report

            </h1>


            <p>

              Track your spending
              from January to December.

            </p>

          </div>

        </div>


        {/* ===============================================
            YEAR SUMMARY
        =============================================== */}

        <section className="year-summary-grid">


          <article className="year-summary-card">

            <div className="year-summary-icon">

              <TrendingDown
                size={22}
              />

            </div>


            <span>

              Total Spent

            </span>


            <strong>

              ₹
              {yearTotal.toLocaleString(
                "en-IN"
              )}

            </strong>

          </article>


          <article className="year-summary-card">

            <div className="year-summary-icon">

              <CalendarDays
                size={22}
              />

            </div>


            <span>

              Transactions

            </span>


            <strong>

              {yearTransactions}

            </strong>

          </article>


        </section>


        {/* ===============================================
            MONTHLY LIST
        =============================================== */}

        <section className="year-months-section">


          <div className="year-months-header">

            <div>

              <h2>

                Monthly Spending

              </h2>


              <p>

                Your expenses for each month

              </p>

            </div>

          </div>


          <div className="year-months-list">


            {monthlyData.map(
              (
                item
              ) => {


                const percentage =
                  highestMonthlySpending > 0
                    ? (
                        item.totalExpenses /
                        highestMonthlySpending
                      ) *
                      100
                    : 0;


                return (

                  <div
                    className="year-month-item"
                    key={item.month}
                  >


                    <div className="year-month-top">


                      <div className="year-month-name">

                        <CalendarDays
                          size={19}
                        />


                        <span>

                          {item.month}

                        </span>

                      </div>


                      <div className="year-month-values">


                        <strong>

                          ₹
                          {item.totalExpenses.toLocaleString(
                            "en-IN"
                          )}

                        </strong>


                        <span>

                          {
                            item.transactionCount
                          }
                          {" "}
                          transaction
                          {
                            item.transactionCount !==
                            1
                              ? "s"
                              : ""
                          }

                        </span>

                      </div>


                    </div>


                    <div className="year-month-progress">


                      <div
                        className="year-month-progress-fill"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>


                  </div>

                );

              }
            )}


          </div>


        </section>


      </section>

    </main>

  );

}


export default YearReport;