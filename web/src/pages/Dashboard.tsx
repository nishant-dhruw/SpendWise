import {
  WalletCards,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import "./Dashboard.css";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import SummaryCard from "../components/SummaryCard";
import SpendingOverview from "../components/SpendingOverview";
import AccountsCard from "../components/AccountsCard";
import RecentTransactions from "../components/RecentTransactions";
import BudgetCard from "../components/BudgetCard";

import { useEffect, useState } from "react";


interface Account {
  name: string;
  type: string;
  balance: number;
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


function Dashboard() {


  // =====================================================
  // ACCOUNTS
  // =====================================================

  const [accounts, setAccounts] =
    useState<Account[]>(() => {

      const savedAccounts =
        localStorage.getItem(
          "spendwise_accounts"
        );


      if (savedAccounts) {

        return JSON.parse(
          savedAccounts
        );

      }


      return [

        {
          name: "Cash",
          type: "cash",
          balance: 5000,
        },

        {
          name: "Bank Account",
          type: "bank",
          balance: 35420,
        },

        {
          name: "Online Wallet",
          type: "wallet",
          balance: 12000,
        },

        {
          name: "Savings Account",
          type: "savings",
          balance: 23000,
        },

      ];

    });


  // Save accounts

  useEffect(() => {

    localStorage.setItem(
      "spendwise_accounts",
      JSON.stringify(accounts)
    );

  }, [accounts]);



  // =====================================================
  // TRANSACTIONS
  // =====================================================

  const [transactions, setTransactions] =
    useState<Transaction[]>(() => {

      const savedTransactions =
        localStorage.getItem(
          "spendwise_transactions"
        );


      if (savedTransactions) {

        return JSON.parse(
          savedTransactions
        );

      }


      return [

        {
          id: 1,
          type: "expense",
          category: "food",
          description: "Food & Dining",
          amount: 250,
          date: "2026-08-29",
          accountName: "Cash",
        },

        {
          id: 2,
          type: "expense",
          category: "transport",
          description: "Transport",
          amount: 120,
          date: "2026-08-29",
          accountName: "Cash",
        },

        {
          id: 3,
          type: "income",
          category: "salary",
          description: "Salary",
          amount: 35000,
          date: "2026-08-28",
          accountName: "Bank Account",
        },

        {
          id: 4,
          type: "expense",
          category: "shopping",
          description: "Shopping",
          amount: 850,
          date: "2026-08-28",
          accountName: "Bank Account",
        },

      ];

    });


  // Save transactions

  useEffect(() => {

    localStorage.setItem(
      "spendwise_transactions",
      JSON.stringify(transactions)
    );

  }, [transactions]);



  // =====================================================
  // TOTAL BALANCE
  // =====================================================

  const totalBalance =
    accounts.reduce(

      (total, account) =>
        total + account.balance,

      0

    );



  // =====================================================
  // CURRENT MONTH TRANSACTIONS
  // =====================================================

  const now =
    new Date();


  const getTransactionDate =
    (dateString: string) => {

      const parsedDate =
        new Date(
          `${dateString}T00:00:00`
        );


      if (
        !isNaN(
          parsedDate.getTime()
        )
      ) {

        return parsedDate;

      }


      return null;

    };


  const currentMonth =
    now.getMonth();


  const currentYear =
    now.getFullYear();



  const monthlyTransactions =
    transactions.filter(

      (transaction) => {

        const transactionDate =
          getTransactionDate(
            transaction.date
          );


        if (!transactionDate) {

          return false;

        }


        return (

          transactionDate.getMonth() ===
            currentMonth &&

          transactionDate.getFullYear() ===
            currentYear

        );

      }

    );



  // =====================================================
  // TOTAL INCOME
  // =====================================================

  const totalIncome =
    monthlyTransactions

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



  // =====================================================
  // TOTAL EXPENSES
  // =====================================================

  const totalExpenses =
    monthlyTransactions

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



  // =====================================================
  // SAVINGS
  // =====================================================

  const totalSavings =
    totalIncome -
    totalExpenses;



  const savingsRate =

    totalIncome > 0

      ? (
          totalSavings /
          totalIncome
        ) * 100

      : 0;



  // =====================================================
  // RENDER
  // =====================================================

  return (

    <main className="dashboard-page">


      <Sidebar />


      {/* ===============================================
          MAIN CONTENT
      =============================================== */}

      <section className="dashboard-main">


        <DashboardHeader />



        {/* ===============================================
            SUMMARY
        =============================================== */}

        <section className="summary-grid">


          <SummaryCard

            title="Total Balance"

            value={`₹${totalBalance.toLocaleString(
              "en-IN"
            )}`}

            description="8.4% from last month"

            type="balance"

            icon={
              <WalletCards
                size={20}
              />
            }

          />



          <SummaryCard

            title="Total Income"

            value={`₹${totalIncome.toLocaleString(
              "en-IN"
            )}`}

            description="This month"

            type="income"

            icon={
              <ArrowUpRight
                size={20}
              />
            }

          />



          <SummaryCard

            title="Total Expenses"

            value={`₹${totalExpenses.toLocaleString(
              "en-IN"
            )}`}

            description="This month"

            type="expense"

            icon={
              <ArrowDownRight
                size={20}
              />
            }

          />



          <SummaryCard

            title="This Month's Savings"

            value={`₹${totalSavings.toLocaleString(
              "en-IN"
            )}`}

            description={
              `${savingsRate.toFixed(
                1
              )}% savings rate`
            }

            type="savings"

            icon={
              <Target
                size={20}
              />
            }

          />


        </section>



        {/* ===============================================
            MIDDLE SECTION
        =============================================== */}

        <section className="dashboard-grid">


          <SpendingOverview
            transactions={transactions}
          />


          <AccountsCard

            accounts={accounts}

            setAccounts={setAccounts}

          />


        </section>



        {/* ===============================================
            BOTTOM SECTION
        =============================================== */}

        <section className="bottom-grid">


          {/* =============================================
              RECENT TRANSACTIONS
          ============================================== */}

          <RecentTransactions

            transactions={transactions}

            accounts={accounts}



            // ===========================================
            // ADD TRANSACTION
            // ===========================================

            onAddTransaction={

              (newTransaction) => {


                // Add transaction

                setTransactions(

                  (
                    currentTransactions
                  ) => [

                    newTransaction,

                    ...currentTransactions,

                  ]

                );



                // Update account balance

                setAccounts(

                  (
                    currentAccounts
                  ) =>

                    currentAccounts.map(

                      (account) => {


                        if (

                          account.name !==
                          newTransaction.accountName

                        ) {

                          return account;

                        }



                        const newBalance =

                          newTransaction.type ===
                          "income"

                            ? (
                                account.balance +
                                newTransaction.amount
                              )

                            : (
                                account.balance -
                                newTransaction.amount
                              );



                        return {

                          ...account,

                          balance:
                            newBalance,

                        };

                      }

                    )

                );

              }

            }



            // ===========================================
            // DELETE TRANSACTION
            // ===========================================

            onDeleteTransaction={

              (transaction) => {


                // Remove transaction

                setTransactions(

                  (
                    currentTransactions
                  ) =>

                    currentTransactions.filter(

                      (
                        currentTransaction
                      ) =>

                        currentTransaction.id !==
                        transaction.id

                    )

                );



                // Restore account balance

                setAccounts(

                  (
                    currentAccounts
                  ) =>

                    currentAccounts.map(

                      (account) => {


                        if (

                          account.name !==
                          transaction.accountName

                        ) {

                          return account;

                        }



                        const restoredBalance =

                          transaction.type ===
                          "expense"

                            ? (
                                account.balance +
                                transaction.amount
                              )

                            : (
                                account.balance -
                                transaction.amount
                              );



                        return {

                          ...account,

                          balance:
                            restoredBalance,

                        };

                      }

                    )

                );

              }

            }



            // ===========================================
            // EDIT TRANSACTION
            // ===========================================

            onEditTransaction={

              (
                oldTransaction,
                updatedTransaction
              ) => {


                // ---------------------------------------
                // Update transaction list
                // ---------------------------------------

                setTransactions(

                  (
                    currentTransactions
                  ) =>

                    currentTransactions.map(

                      (
                        transaction
                      ) =>

                        transaction.id ===
                        oldTransaction.id

                          ? updatedTransaction

                          : transaction

                    )

                );



                // ---------------------------------------
                // Update account balances
                // ---------------------------------------

                setAccounts(

                  (
                    currentAccounts
                  ) =>

                    currentAccounts.map(

                      (
                        account
                      ) => {


                        let newBalance =
                          account.balance;



                        // =================================
                        // STEP 1
                        // Undo OLD transaction
                        // =================================

                        if (

                          account.name ===
                          oldTransaction.accountName

                        ) {


                          if (

                            oldTransaction.type ===
                            "expense"

                          ) {


                            // Expense was previously removed
                            // from balance, so add it back

                            newBalance +=
                              oldTransaction.amount;

                          }

                          else {


                            // Income was previously added
                            // to balance, so remove it

                            newBalance -=
                              oldTransaction.amount;

                          }

                        }



                        // =================================
                        // STEP 2
                        // Apply UPDATED transaction
                        // =================================

                        if (

                          account.name ===
                          updatedTransaction.accountName

                        ) {


                          if (

                            updatedTransaction.type ===
                            "expense"

                          ) {


                            newBalance -=
                              updatedTransaction.amount;

                          }

                          else {


                            newBalance +=
                              updatedTransaction.amount;

                          }

                        }



                        return {

                          ...account,

                          balance:
                            newBalance,

                        };

                      }

                    )

                );

              }

            }

          />



          {/* =============================================
              BUDGET
          ============================================== */}

          <BudgetCard

            totalExpenses={
              totalExpenses
            }

          />


        </section>


      </section>


    </main>

  );

}


export default Dashboard;