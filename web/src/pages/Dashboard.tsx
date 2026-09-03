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

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


// =====================================================
// ACCOUNT INTERFACE
// =====================================================

interface Account {
  name: string;
  type: string;
  balance: number;
}


// =====================================================
// TRANSACTION INTERFACE
// =====================================================

interface Transaction {
  id: number;

  type:
    | "income"
    | "expense";

  category: string;

  description: string;

  amount: number;

  date: string;

  accountName: string;
}


// =====================================================
// COMPONENT
// =====================================================

function Dashboard() {

  const navigate = useNavigate();


  // =====================================================
  // AUTHENTICATION CHECK
  // =====================================================

  useEffect(() => {

    const localToken =
      localStorage.getItem("token");


    const sessionToken =
      sessionStorage.getItem("token");


    // Check both storage locations

    if (

      !localToken &&
      !sessionToken

    ) {

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    }

  }, [navigate]);


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


  // =====================================================
  // SAVE ACCOUNTS
  // =====================================================

  useEffect(() => {

    localStorage.setItem(

      "spendwise_accounts",

      JSON.stringify(
        accounts
      )

    );


    window.dispatchEvent(

      new Event(
        "spendwise_accounts_updated"
      )

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


  // =====================================================
  // SAVE TRANSACTIONS
  // =====================================================

  useEffect(() => {

    localStorage.setItem(

      "spendwise_transactions",

      JSON.stringify(
        transactions
      )

    );


    window.dispatchEvent(

      new Event(
        "spendwise_transactions_updated"
      )

    );

  }, [transactions]);


  // =====================================================
  // UPDATE ACCOUNT BALANCE
  // =====================================================

  const updateAccountBalance = (

    currentAccounts: Account[],

    transaction: Transaction,

    action:
      | "add"
      | "remove"

  ) => {


    return currentAccounts.map(
      (account) => {


        if (

          account.name !==
          transaction.accountName

        ) {

          return account;

        }


        let balanceChange =
          transaction.amount;


        // Expense decreases balance

        if (

          transaction.type ===
          "expense"

        ) {

          balanceChange =
            -balanceChange;

        }


        // Removing reverses transaction

        if (

          action ===
          "remove"

        ) {

          balanceChange =
            -balanceChange;

        }


        return {

          ...account,

          balance:

            account.balance +
            balanceChange,

        };

      }

    );

  };


  // =====================================================
  // TOTAL BALANCE
  // =====================================================

  const totalBalance =
    accounts.reduce(

      (total, account) =>

        total +
        account.balance,

      0

    );


  // =====================================================
  // CURRENT DATE
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


  // =====================================================
  // CURRENT MONTH TRANSACTIONS
  // =====================================================

  const monthlyTransactions =
    transactions.filter(

      (transaction) => {


        const transactionDate =
          getTransactionDate(
            transaction.date
          );


        if (
          !transactionDate
        ) {

          return false;

        }


        return (

          transactionDate.getMonth() ===
            currentMonth

          &&

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
    monthlyTransactions

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


      <section className="dashboard-main">


        {/* HEADER */}

        <DashboardHeader />


        {/* SUMMARY CARDS */}

        <section className="summary-grid">


          <SummaryCard

            title="Total Balance"

            value={`₹${totalBalance.toLocaleString(
              "en-IN"
            )}`}

            description="Across all accounts"

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


        {/* MIDDLE SECTION */}

        <section className="dashboard-grid">


          <SpendingOverview

            transactions={
              transactions
            }

          />


          <AccountsCard

            accounts={
              accounts
            }

            setAccounts={
              setAccounts
            }


            /* ADD ACCOUNT INITIAL BALANCE TRANSACTION */

            onAddTransaction={

              (newTransaction) => {


                setTransactions(

                  (currentTransactions) => [

                    newTransaction,

                    ...currentTransactions,

                  ]

                );

              }

            }


            /* EDIT ACCOUNT */

            onEditAccount={

              (
                oldAccount,
                updatedAccount
              ) => {


                const duplicateType =
                  accounts.some(

                    (account) =>

                      account.type ===
                        updatedAccount.type

                      &&

                      account.name !==
                        oldAccount.name

                  );


                if (
                  duplicateType
                ) {

                  return;

                }


                setAccounts(

                  (currentAccounts) =>

                    currentAccounts.map(

                      (account) =>

                        account.name ===
                        oldAccount.name

                          ? updatedAccount

                          : account

                    )

                );


                // UPDATE ACCOUNT NAME IN TRANSACTIONS

                if (

                  oldAccount.name !==
                  updatedAccount.name

                ) {


                  setTransactions(

                    (currentTransactions) =>

                      currentTransactions.map(

                        (transaction) => {

                          if (

                            transaction.accountName ===
                            oldAccount.name

                          ) {

                            return {

                              ...transaction,

                              accountName:
                                updatedAccount.name,

                            };

                          }


                          return transaction;

                        }

                      )

                  );

                }

              }

            }

          />


        </section>


        {/* BOTTOM SECTION */}

        <section className="bottom-grid">


          {/* RECENT TRANSACTIONS */}

          <RecentTransactions

            transactions={

              transactions

                .slice()

                .sort(

                  (a, b) =>

                    new Date(

                      `${b.date}T00:00:00`

                    ).getTime()

                    -

                    new Date(

                      `${a.date}T00:00:00`

                    ).getTime()

                )

                .slice(
                  0,
                  5
                )

            }


            accounts={
              accounts
            }


            // ADD TRANSACTION

            onAddTransaction={

              (
                newTransaction
              ) => {


                setTransactions(

                  (currentTransactions) => [

                    newTransaction,

                    ...currentTransactions,

                  ]

                );


                setAccounts(

                  (currentAccounts) =>

                    updateAccountBalance(

                      currentAccounts,

                      newTransaction,

                      "add"

                    )

                );

              }

            }


            // DELETE TRANSACTION

            onDeleteTransaction={

              (
                transaction
              ) => {


                setTransactions(

                  (currentTransactions) =>

                    currentTransactions.filter(

                      (
                        currentTransaction
                      ) =>

                        currentTransaction.id !==
                        transaction.id

                    )

                );


                setAccounts(

                  (currentAccounts) =>

                    updateAccountBalance(

                      currentAccounts,

                      transaction,

                      "remove"

                    )

                );

              }

            }


            // EDIT TRANSACTION

            onEditTransaction={

              (

                oldTransaction,

                updatedTransaction

              ) => {


                setTransactions(

                  (currentTransactions) =>

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


                setAccounts(

                  (currentAccounts) => {


                    const accountsWithoutOldEffect =

                      updateAccountBalance(

                        currentAccounts,

                        oldTransaction,

                        "remove"

                      );


                    return updateAccountBalance(

                      accountsWithoutOldEffect,

                      updatedTransaction,

                      "add"

                    );

                  }

                );

              }

            }

          />


          {/* MONTHLY BUDGET */}

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