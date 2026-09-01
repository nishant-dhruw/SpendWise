import { Bell } from "lucide-react";
import "./DashboardHeader.css";

function DashboardHeader() {

  // ================= CURRENT DATE =================

  const today = new Date();

  const formattedDate = today
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();


  return (
    <header className="dashboard-header">

      <div className="dashboard-header-left">

        <p className="dashboard-date">
          {formattedDate}
        </p>

        <h2>
          Good morning, Nishant 👋
        </h2>

        <p className="dashboard-subtitle">
          Here's your financial overview.
        </p>

      </div>


      <div className="header-actions">

        <button className="notification-button">
          <Bell size={19} />

          <span className="notification-dot"></span>
        </button>


        <div className="profile">

          <div className="profile-avatar">
            N
          </div>

          <div className="profile-info">
            <strong>Nishant</strong>
            <span>Personal</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default DashboardHeader;