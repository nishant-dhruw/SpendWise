import {
  WalletCards,
  LayoutDashboard,
  Receipt,
  CreditCard,
  BarChart3,
  Target,
  Settings,
  LogOut,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="dashboard-sidebar">

      {/* Brand */}
      <div className="sidebar-brand">

        <div className="sidebar-logo">
          <WalletCards size={23} />
        </div>

        <div>
          <h1>
            Spend<span>Wise</span>
          </h1>

          <p>
            Know where your money goes.
          </p>
        </div>

      </div>


      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-title">
          MENU
        </p>

        <button className="nav-item active">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button className="nav-item">
          <Receipt size={18} />
          <span>Transactions</span>
        </button>

        <button className="nav-item">
          <CreditCard size={18} />
          <span>Accounts</span>
        </button>

        <button className="nav-item">
          <BarChart3 size={18} />
          <span>Budgets</span>
        </button>

        <button className="nav-item">
          <Target size={18} />
          <span>Goals</span>
        </button>

        <button className="nav-item">
          <BarChart3 size={18} />
          <span>Reports</span>
        </button>


        <p className="nav-title nav-title-settings">
          SETTINGS
        </p>

        <button className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

      </nav>


      {/* Logout */}
      <button className="logout-button">
        <LogOut size={18} />
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default Sidebar;