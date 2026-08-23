import {
  WalletCards,
  LayoutDashboard,
  Receipt,
  CreditCard,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
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

  // ================= ACCOUNTS =================

  const [accounts, setAccounts] = useState<Account[]>(() => {

    const savedAccounts = localStorage.getItem(
      "spendwise_accounts"
    );

    if (savedAccounts) {
      return JSON.parse(savedAccounts);
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


  // Save accounts whenever they change

  useEffect(() => {

    localStorage.setItem(
      "spendwise_accounts",
      JSON.stringify(accounts)
    );

  }, [accounts]);


  // ================= TRANSACTIONS =================

const [transactions, setTransactions] = useState<Transaction[]>(() => {

  const savedTransactions = localStorage.getItem(
    "spendwise_transactions"
  );

  if (savedTransactions) {
    return JSON.parse(savedTransactions);
  }

  return [
    {
      id: 1,
      type: "expense",
      category: "food",
      description: "Food & Dining",
      amount: 250,
      date: "Today · 1:20 PM",
      accountName: "Cash",
    },

    {
      id: 2,
      type: "expense",
      category: "transport",
      description: "Transport",
      amount: 120,
      date: "Today · 10:15 AM",
      accountName: "Cash",
    },

    {
      id: 3,
      type: "income",
      category: "salary",
      description: "Salary",
      amount: 35000,
      date: "Yesterday · 9:00 AM",
      accountName: "Bank Account",
    },

    {
      id: 4,
      type: "expense",
      category: "shopping",
      description: "Shopping",
      amount: 850,
      date: "Yesterday · 6:40 PM",
      accountName: "Bank Account",
    },
  ];

});

// Save transactions whenever they change

useEffect(() => {

  localStorage.setItem(
    "spendwise_transactions",
    JSON.stringify(transactions)
  );

}, [transactions]);


  // ================= TOTAL BALANCE =================

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0
  );


  return (
    <main className="dashboard-page">

      <Sidebar />
      {/* ================= MAIN CONTENT ================= */}
      <section className="dashboard-main">
        {/* Top bar */}
        <DashboardHeader />

        {/* ================= SUMMARY ================= */}
        <section className="summary-grid">
              <SummaryCard
                title="Total Balance"
                value={`₹${totalBalance.toLocaleString("en-IN")}`}
                description="8.4% from last month"
                type="balance"
                icon={<WalletCards size={20} />}
              />

              <SummaryCard
                title="Total Income"
                value="₹50,000"
                description="This month"
                type="income"
                icon={<ArrowUpRight size={20} />}
              />

              <SummaryCard
                title="Total Expenses"
                value="₹24,580"
                description="This month"
                type="expense"
                icon={<ArrowDownRight size={20} />}
              />

              <SummaryCard
                title="This Month's Savings"
                value="₹25,420"
                description="50.8% savings rate"
                type="savings"
                icon={<Target size={20} />}
              />
        </section>

        {/* ================= MIDDLE SECTION ================= */}
        <section className="dashboard-grid">
          <SpendingOverview />
          {/* Accounts */}
          <AccountsCard
            accounts={accounts}
            setAccounts={setAccounts}
/>
        </section>

        {/* ================= BOTTOM ================= */}
        <section className="bottom-grid">
          {/* Recent Transactions */}
          <RecentTransactions
            transactions={transactions}
            accounts={accounts}
            onAddTransaction={(newTransaction) => {

              // Add transaction
              setTransactions((currentTransactions) => [
                newTransaction,
                ...currentTransactions,
              ]);

              // Update account balance
              setAccounts((currentAccounts) =>
                currentAccounts.map((account) => {

                  if (account.name !== newTransaction.accountName) {
                    return account;
                  }

                  const newBalance =
                    newTransaction.type === "income"
                      ? account.balance + newTransaction.amount
                      : account.balance - newTransaction.amount;

                  return {
                    ...account,
                    balance: newBalance,
                  };

                })
              );

            }}
          />

          {/* Budget */}
          <BudgetCard />
        </section>

      </section>

    </main>
  );
}

export default Dashboard;