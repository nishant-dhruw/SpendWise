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

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  

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


        {/* Dashboard */}
        <button
          className={`nav-item ${
            location.pathname === "/dashboard"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>


        {/* Transactions */}
        <button
          className={`nav-item ${
            location.pathname === "/transactions"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/transactions")}
        >
          <Receipt size={18} />
          <span>Transactions</span>
        </button>


        {/* Accounts */}
        <button
          className={`nav-item ${
            location.pathname === "/accounts"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/accounts")}
        >
          <CreditCard size={18} />
          <span>Accounts</span>
        </button>


        {/* Budgets */}
        <button
          className={`nav-item ${
            location.pathname === "/budgets"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/budgets")
          }
        >
          <BarChart3 size={18} />
          <span>Budgets</span>
        </button>


        {/* Goals */}
        <button
          className={`nav-item ${
            location.pathname === "/goals"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/goals")
          }
        >
          <Target size={18} />
          <span>Goals</span>
        </button>

        {/* Reports */}
        <button
          className={`nav-item ${
            location.pathname === "/reports"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/reports")
          }
        >
          <BarChart3 size={18} />
          <span>Reports</span>
        </button>


        {/* Settings */}
        <p className="nav-title nav-title-settings">
          SETTINGS
        </p>


        <button
          className="nav-item"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

      </nav>


      {/* Logout */}
      <button className="logout-button">

        <LogOut size={18} />

        <span>
          Logout
        </span>

      </button>

    </aside>
  );
}

export default Sidebar;