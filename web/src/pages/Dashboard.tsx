import {
  WalletCards,
  Target,
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

  _id?: string;

  name: string;

  type: string;

  balance: number;

}


// =====================================================
// TRANSACTION INTERFACE
// =====================================================

interface Transaction {

  id: string;

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
// BACKEND TRANSACTION INTERFACE
// =====================================================

interface BackendTransaction {

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


// =====================================================
// COMPONENT
// =====================================================

function Dashboard() {

  const navigate =
    useNavigate();


  // ===================================================
  // ACCOUNTS STATE
  // ===================================================

  const [
    accounts,
    setAccounts,
  ] = useState<Account[]>([]);


  const [
    accountsLoading,
    setAccountsLoading,
  ] = useState(true);


  const [
    accountsError,
    setAccountsError,
  ] = useState("");


  // ===================================================
  // TRANSACTIONS STATE
  // ===================================================

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);


  const [
    transactionsLoading,
    setTransactionsLoading,
  ] = useState(true);


  // ===================================================
  // GET TOKEN
  // ===================================================

  const getToken = () => {

    return (

      localStorage.getItem(
        "token"
      )

      ||

      sessionStorage.getItem(
        "token"
      )

    );

  };


  // ===================================================
  // AUTH CHECK
  // ===================================================

  useEffect(() => {

    const token =
      getToken();

    if (!token) {

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    }

  }, [navigate]);


  // ===================================================
  // FETCH ACCOUNTS
  // ===================================================

  const fetchAccounts =
    async () => {

      try {

        setAccountsLoading(
          true
        );

        setAccountsError(
          ""
        );

        const token =
          getToken();

        if (!token) {

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;

        }

        const response =
          await fetch(
            "http://localhost:5000/api/accounts",
            {
              method:
                "GET",

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


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to fetch accounts."
          );

        }


        const formattedAccounts =
          data.accounts.map(
            (
              account: Account
            ) => ({

              ...account,

              type:
                account.type.toLowerCase(),

            })
          );


        setAccounts(
          formattedAccounts
        );

      } catch (error) {

        console.error(
          "Error fetching accounts:",
          error
        );


        if (
          error instanceof Error
        ) {

          setAccountsError(
            error.message
          );

        } else {

          setAccountsError(
            "Unable to fetch accounts."
          );

        }

      } finally {

        setAccountsLoading(
          false
        );

      }

    };


  // ===================================================
  // FETCH TRANSACTIONS
  // ===================================================

  const fetchTransactions =
    async () => {

      try {

        setTransactionsLoading(
          true
        );

        const token =
          getToken();


        if (!token) {

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;

        }


        const response =
          await fetch(
            "http://localhost:5000/api/transactions",
            {
              method:
                "GET",

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


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to fetch transactions."
          );

        }


        const formattedTransactions:
          Transaction[] =

          data.transactions.map(
            (
              transaction:
                BackendTransaction
            ) => {

              const account =
                accounts.find(
                  (
                    account
                  ) =>
                    account._id ===
                    transaction.account
                );


              return {

                id:
                  transaction._id,

                type:
                  transaction.type,

                category:
                  transaction.category,

                description:
                  transaction.description,

                amount:
                  Number(
                    transaction.amount
                  ),

                date:
                  transaction.date
                    .split("T")[0],

                accountName:
                  account?.name ||
                  "Unknown Account",

              };

            }
          );


        setTransactions(
          formattedTransactions
        );


      } catch (error) {

        console.error(
          "Error fetching transactions:",
          error
        );

      } finally {

        setTransactionsLoading(
          false
        );

      }

    };


  // ===================================================
  // INITIAL LOAD ACCOUNTS
  // ===================================================

  useEffect(() => {

    fetchAccounts();

  }, []);


  // ===================================================
  // FETCH TRANSACTIONS AFTER ACCOUNTS LOAD
  // ===================================================

  useEffect(() => {

    if (
      accounts.length > 0 ||
      !accountsLoading
    ) {

      fetchTransactions();

    }

  }, [
    accounts.length,
    accountsLoading
  ]);


  // ===================================================
  // TOTAL MONEY
  // ===================================================

  const totalBalance =

    accounts.reduce(
      (
        total,
        account
      ) =>
        total +
        Number(
          account.balance
        ),
      0
    );


  // ===================================================
  // DATE HELPERS
  // ===================================================

  const now =
    new Date();


  const getTransactionDate = (
    dateString: string
  ) => {

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


  // ===================================================
  // CURRENT MONTH TRANSACTIONS
  // ===================================================

  const monthlyTransactions =

    transactions.filter(
      (
        transaction
      ) => {

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


  // ===================================================
  // TOTAL INCOME
  //
  // Used internally for calculating savings.
  // Not displayed as a dashboard card.
  // =====================================================

  const totalIncome =

    monthlyTransactions
      .filter(
        (
          transaction
        ) =>
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


  // ===================================================
  // TOTAL EXPENSES
  // ===================================================

  const totalExpenses =

    monthlyTransactions
      .filter(
        (
          transaction
        ) =>
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
  // THIS MONTH'S SAVINGS
  //
  // Income - Expenses
  // =====================================================

  const totalSavings =
    totalIncome -
    totalExpenses;


  // ===================================================
  // ADD TRANSACTION
  // ===================================================

  const handleAddTransaction =

    async (
      newTransaction:
        Transaction
    ): Promise<void> => {

      const token =
        getToken();


      if (!token) {

        throw new Error(
          "Authentication token not found."
        );

      }


      // ===============================================
      // FIND SELECTED ACCOUNT
      // ===============================================

      const selectedAccount =

        accounts.find(
          (
            account
          ) =>
            account.name ===
            newTransaction.accountName
        );


      if (
        !selectedAccount ||
        !selectedAccount._id
      ) {

        throw new Error(
          "Selected account was not found."
        );

      }


      // ===============================================
      // REQUEST BODY
      // ===============================================

      const requestBody = {

        type:
          newTransaction.type,

        category:
          newTransaction.category,

        description:
          newTransaction.description,

        amount:
          Number(
            newTransaction.amount
          ),

        date:
          newTransaction.date,

        account:
          selectedAccount._id,

      };


      console.log(
        "Sending transaction to backend:",
        requestBody
      );


      // ===============================================
      // POST TO BACKEND
      // ===============================================

      const response =
        await fetch(
          "http://localhost:5000/api/transactions",
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                requestBody
              ),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Backend transaction error:",
          data
        );


        throw new Error(
          data.message ||
          "Failed to add transaction."
        );

      }


      console.log(
        "Transaction created successfully:",
        data
      );


      // ===============================================
      // REFRESH ACCOUNTS
      // ===============================================

      await fetchAccounts();


      // ===============================================
      // ADD TRANSACTION TO CURRENT STATE
      // ===============================================

      setTransactions(
        (
          currentTransactions
        ) => [

          {
            id:
              data.transaction._id,

            type:
              data.transaction.type,

            category:
              data.transaction.category,

            description:
              data.transaction.description,

            amount:
              Number(
                data.transaction.amount
              ),

            date:
              data.transaction.date
                .split("T")[0],

            accountName:
              selectedAccount.name,

          },

          ...currentTransactions,

        ]
      );

    };


  // ===================================================
  // EDIT TRANSACTION
  // ===================================================

  const handleEditTransaction =

    async (
      oldTransaction:
        Transaction,

      updatedTransaction:
        Transaction
    ): Promise<void> => {

      const token =
        getToken();


      if (!token) {

        throw new Error(
          "Authentication token not found."
        );

      }


      const selectedAccount =

        accounts.find(
          (
            account
          ) =>
            account.name ===
            updatedTransaction.accountName
        );


      if (
        !selectedAccount ||
        !selectedAccount._id
      ) {

        throw new Error(
          "Selected account was not found."
        );

      }


      const requestBody = {

        type:
          updatedTransaction.type,

        category:
          updatedTransaction.category,

        description:
          updatedTransaction.description,

        amount:
          Number(
            updatedTransaction.amount
          ),

        date:
          updatedTransaction.date,

        account:
          selectedAccount._id,

      };


      const response =
        await fetch(
          `http://localhost:5000/api/transactions/${oldTransaction.id}`,
          {
            method:
              "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                requestBody
              ),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update transaction."
        );

      }


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

                ?

                  {
                    ...updatedTransaction,

                    id:
                      oldTransaction.id,
                  }

                :

                  transaction

          )
      );


      await fetchAccounts();

    };


  // ===================================================
  // DELETE TRANSACTION
  // ===================================================

  const handleDeleteTransaction =

    async (
      transaction:
        Transaction
    ): Promise<void> => {

      const token =
        getToken();


      if (!token) {

        throw new Error(
          "Authentication token not found."
        );

      }


      const response =
        await fetch(
          `http://localhost:5000/api/transactions/${transaction.id}`,
          {
            method:
              "DELETE",

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


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete transaction."
        );

      }


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


      await fetchAccounts();

    };


  // ===================================================
  // ADD ACCOUNT
  // ===================================================

  const handleAddAccount =

    async (
      newAccount:
        Account
    ): Promise<void> => {

      const token =
        getToken();


      if (!token) {

        navigate(
          "/login",
          {
            replace: true,
          }
        );


        throw new Error(
          "Authentication token not found."
        );

      }


      const backendType =

        newAccount.type
          .charAt(0)
          .toUpperCase()

        +

        newAccount.type
          .slice(1)
          .toLowerCase();


      const response =
        await fetch(
          "http://localhost:5000/api/accounts",
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  newAccount.name,

                type:
                  backendType,

                balance:
                  Number(
                    newAccount.balance
                  ),
              }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add account."
        );

      }


      const savedAccount:
        Account = {

        ...data.account,

        type:
          data.account.type
            .toLowerCase(),

      };


      setAccounts(
        (
          currentAccounts
        ) => [

          ...currentAccounts,

          savedAccount,

        ]
      );

    };


  // ===================================================
  // EDIT ACCOUNT
  // ===================================================

  const handleEditAccount =

    async (
      oldAccount:
        Account,

      updatedAccount:
        Account
    ): Promise<void> => {

      const token =
        getToken();


      if (
        !token ||
        !oldAccount._id
      ) {

        throw new Error(
          "Account ID or authentication token not found."
        );

      }


      const backendType =

        updatedAccount.type
          .charAt(0)
          .toUpperCase()

        +

        updatedAccount.type
          .slice(1)
          .toLowerCase();


      const response =
        await fetch(
          `http://localhost:5000/api/accounts/${oldAccount._id}`,
          {
            method:
              "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  updatedAccount.name,

                type:
                  backendType,

                balance:
                  Number(
                    updatedAccount.balance
                  ),
              }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update account."
        );

      }


      const savedAccount:
        Account = {

        ...data.account,

        type:
          data.account.type
            .toLowerCase(),

      };


      setAccounts(
        (
          currentAccounts
        ) =>

          currentAccounts.map(
            (
              account
            ) =>

              account._id ===
              oldAccount._id

                ?

                  savedAccount

                :

                  account

          )
      );

    };


  // ===================================================
  // DELETE ACCOUNT
  // ===================================================

  const handleDeleteAccount =

    async (
      account:
        Account
    ): Promise<void> => {

      const token =
        getToken();


      if (
        !token ||
        !account._id
      ) {

        throw new Error(
          "Account ID or authentication token not found."
        );

      }


      const response =
        await fetch(
          `http://localhost:5000/api/accounts/${account._id}`,
          {
            method:
              "DELETE",

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


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete account."
        );

      }


      setAccounts(
        (
          currentAccounts
        ) =>

          currentAccounts.filter(
            (
              currentAccount
            ) =>

              currentAccount._id !==
              account._id

          )
      );


      setTransactions(
        (
          currentTransactions
        ) =>

          currentTransactions.filter(
            (
              transaction
            ) =>

              transaction.accountName !==
              account.name

          )
      );

    };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <main className="dashboard-page">


      <Sidebar />


      <section className="dashboard-main">


        <DashboardHeader />


        {/* =================================================
            ERROR
        ================================================= */}

        {accountsError && (

          <div
            style={{

              color:
                "#dc2626",

              backgroundColor:
                "#fef2f2",

              border:
                "1px solid #fecaca",

              padding:
                "12px",

              borderRadius:
                "8px",

              marginBottom:
                "20px",

            }}
          >

            {accountsError}

          </div>

        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="summary-grid">


          {/* =================================================
              TOTAL MONEY
          ================================================= */}

          <SummaryCard

            title="Total Money"

            value={
              `₹${totalBalance.toLocaleString(
                "en-IN"
              )}`
            }

            description="Across all accounts"

            type="balance"

            icon={
              <WalletCards
                size={20}
              />
            }

          />


          {/* =================================================
              THIS MONTH'S EXPENSES
          ================================================= */}

          <SummaryCard

            title="This Month's Expenses"

            value={
              `₹${totalExpenses.toLocaleString(
                "en-IN"
              )}`
            }

            description="This month"

            type="expense"

            icon={
              <ArrowDownRight
                size={20}
              />
            }

          />


          {/* =================================================
              THIS MONTH'S SAVINGS
          ================================================= */}

          <SummaryCard

            title="This Month's Savings"

            value={
              `₹${totalSavings.toLocaleString(
                "en-IN"
              )}`
            }

            description="Income minus expenses"

            type="savings"

            icon={
              <Target
                size={20}
              />
            }

          />


        </section>


        {/* =================================================
            MIDDLE
        ================================================= */}

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

            onAddAccount={
              handleAddAccount
            }

            onAddTransaction={
              handleAddTransaction
            }

            onEditAccount={
              handleEditAccount
            }

            onDeleteAccount={
              handleDeleteAccount
            }

          />


        </section>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <section className="bottom-grid">


          <RecentTransactions

            transactions={

              transactions

                .slice()

                .sort(
                  (
                    a,
                    b
                  ) =>

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


            onAddTransaction={
              handleAddTransaction
            }


            onDeleteTransaction={
              handleDeleteTransaction
            }


            onEditTransaction={
              handleEditTransaction
            }

          />


          <BudgetCard

            totalExpenses={
              totalExpenses
            }

          />


        </section>


        {/* =================================================
            HIDDEN LOADING STATES
        ================================================= */}

        {accountsLoading && (

          <p
            style={{
              display:
                "none",
            }}
          >

            Loading accounts...

          </p>

        )}


        {transactionsLoading && (

          <p
            style={{
              display:
                "none",
            }}
          >

            Loading transactions...

          </p>

        )}


      </section>

    </main>

  );

}


export default Dashboard;