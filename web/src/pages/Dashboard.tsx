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

function Dashboard() {
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
                value="₹75,420"
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
          <AccountsCard />
        </section>

        {/* ================= BOTTOM ================= */}
        <section className="bottom-grid">
          {/* Recent Transactions */}
          <RecentTransactions />

          {/* Budget */}
          <BudgetCard />
        </section>

      </section>

    </main>
  );
}

export default Dashboard;