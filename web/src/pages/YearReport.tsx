import { useEffect, useState } from "react";

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


// =========================================================
// TRANSACTION INTERFACE
// =========================================================

interface Transaction {

  _id: string;

  type:
    | "income"
    | "expense";

  category: string;

  description: string;

  amount: number;

  date: string;

  account: string;

}


// =========================================================
// COMPONENT
// =========================================================

function YearReport() {

  // =======================================================
  // NAVIGATION
  // =======================================================

  const navigate =
    useNavigate();


  // =======================================================
  // GET YEAR FROM URL
  // =======================================================

  const { year } =
    useParams();


  const selectedYear =
    Number(year);


  // =======================================================
  // TRANSACTIONS STATE
  // =======================================================

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // =======================================================
  // GET TOKEN
  // =======================================================

  const getToken = () => {

    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );

  };


  // =======================================================
  // FETCH TRANSACTIONS
  // =======================================================

  useEffect(() => {

    const fetchTransactions =
      async () => {

        try {

          setLoading(true);

          setError("");


          const token =
            getToken();


          // ===============================================
          // AUTH CHECK
          // ===============================================

          if (!token) {

            navigate(
              "/login",
              {
                replace: true,
              }
            );

            return;

          }


          // ===============================================
          // FETCH BACKEND TRANSACTIONS
          // ===============================================

          const response =
            await fetch(
              "http://localhost:5000/api/transactions",
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );


          const data =
            await response.json();


          // ===============================================
          // CHECK RESPONSE
          // ===============================================

          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to fetch transactions."
            );

          }


          // ===============================================
          // SAVE TRANSACTIONS
          // ===============================================

          setTransactions(
            data.transactions || []
          );


        } catch (err) {

          console.error(
            "Error fetching yearly report:",
            err
          );


          if (
            err instanceof Error
          ) {

            setError(
              err.message
            );

          } else {

            setError(
              "Unable to load yearly report."
            );

          }


        } finally {

          setLoading(false);

        }

      };


    fetchTransactions();

  }, [navigate]);


  // =======================================================
  // MONTHS
  // =======================================================

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


  // =======================================================
  // MONTHLY EXPENSE DATA
  // =======================================================

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

              const dateString =
                transaction.date
                  .split("T")[0];


              const date =
                new Date(
                  `${dateString}T00:00:00`
                );


              return (

                transaction.type ===
                  "expense"

                &&

                date.getFullYear() ===
                  selectedYear

                &&

                date.getMonth() ===
                  monthIndex

              );

            }
          );


        // =============================================
        // MONTH EXPENSE TOTAL
        // =============================================

        const totalExpenses =
          monthTransactions.reduce(
            (
              total,
              transaction
            ) =>
              total +
              Number(
                transaction.amount
              ),
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


  // =======================================================
  // HIGHEST MONTHLY SPENDING
  // =======================================================

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


  // =======================================================
  // YEAR TOTAL
  // =======================================================

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


  // =======================================================
  // YEAR TRANSACTIONS
  //
  // Count ALL transactions for the selected year,
  // not only expenses.
  // =======================================================

  const yearTransactions =
    transactions.filter(
      (
        transaction
      ) => {

        const dateString =
          transaction.date
            .split("T")[0];


        const date =
          new Date(
            `${dateString}T00:00:00`
          );


        return (
          date.getFullYear() ===
          selectedYear
        );

      }
    ).length;


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <main
      className="year-report-page"
    >

      <Sidebar />


      <section
        className="year-report-main"
      >

        {/* ===============================================
            HEADER
        =============================================== */}

        <div
          className="year-report-header"
        >

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
            ERROR
        =============================================== */}

        {error && (

          <div
            style={{
              color: "#dc2626",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >

            {error}

          </div>

        )}


        {/* ===============================================
            LOADING
        =============================================== */}

        {loading ? (

          <div
            className="reports-empty-state"
          >

            <h3>
              Loading report...
            </h3>


            <p>
              Fetching your transaction
              data.
            </p>

          </div>

        ) : (

          <>

            {/* =============================================
                YEAR SUMMARY
            ============================================= */}

            <section
              className="year-summary-grid"
            >

              <article
                className="year-summary-card"
              >

                <div
                  className="year-summary-icon"
                >

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


              <article
                className="year-summary-card"
              >

                <div
                  className="year-summary-icon"
                >

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


            {/* =============================================
                MONTHLY LIST
            ============================================= */}

            <section
              className="year-months-section"
            >

              <div
                className="year-months-header"
              >

                <div>

                  <h2>
                    Monthly Spending
                  </h2>


                  <p>
                    Your expenses for each month
                  </p>

                </div>

              </div>


              <div
                className="year-months-list"
              >

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

                        <div
                          className="year-month-top"
                        >

                          <div
                            className="year-month-name"
                          >

                            <CalendarDays
                              size={19}
                            />


                            <span>
                              {item.month}
                            </span>

                          </div>


                          <div
                            className="year-month-values"
                          >

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


                        <div
                          className="year-month-progress"
                        >

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

          </>

        )}

      </section>

    </main>

  );

}


export default YearReport;