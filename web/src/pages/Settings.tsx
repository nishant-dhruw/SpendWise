import { useState } from "react";
import {
  User,
  Mail,
  LockKeyhole,
  Bell,
  Palette,
  IndianRupee,
  LogOut,
  Trash2,
  Save,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

import "./Settings.css";

function Settings() {
  const savedUser = localStorage.getItem("user");

  const user = savedUser
    ? JSON.parse(savedUser)
    : {
        name: "User",
        email: "user@example.com",
      };

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const [currency, setCurrency] = useState("INR");

  const [notifications, setNotifications] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      email,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <main className="settings-page">

      <Sidebar />

      <section className="settings-main">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="settings-header">

          <div>
            <h1>Settings</h1>

            <p>
              Manage your profile, preferences, and
              account settings.
            </p>
          </div>

          <button
            className="settings-save-button"
            onClick={handleSave}
          >
            {saved ? (
              <>
                <CheckCircle2 size={18} />
                Saved
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>

        </div>


        {/* =========================================
            PROFILE
        ========================================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon profile-icon">
              <User size={20} />
            </div>

            <div>
              <h2>Profile</h2>

              <p>
                Manage your personal information.
              </p>
            </div>

          </div>


          <div className="settings-form-grid">

            <div className="settings-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="settings-input-wrapper">

                <User size={18} />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                />

              </div>

            </div>


            <div className="settings-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="settings-input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                />

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            SECURITY
        ========================================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon security-icon">
              <LockKeyhole size={20} />
            </div>

            <div>
              <h2>Security</h2>

              <p>
                Keep your SpendWise account secure.
              </p>
            </div>

          </div>


          <div className="settings-option">

            <div className="settings-option-left">

              <div className="settings-option-icon">
                <LockKeyhole size={18} />
              </div>

              <div>
                <strong>Change Password</strong>

                <span>
                  Update your account password regularly.
                </span>
              </div>

            </div>

            <button className="settings-outline-button">
              Change Password
            </button>

          </div>

        </section>


        {/* =========================================
            PREFERENCES
        ========================================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon preferences-icon">
              <Palette size={20} />
            </div>

            <div>
              <h2>Preferences</h2>

              <p>
                Customize how SpendWise works for you.
              </p>
            </div>

          </div>


          {/* Currency */}

          <div className="settings-option">

            <div className="settings-option-left">

              <div className="settings-option-icon">
                <IndianRupee size={18} />
              </div>

              <div>
                <strong>Currency</strong>

                <span>
                  Choose the currency used throughout
                  SpendWise.
                </span>
              </div>

            </div>


            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value)
              }
              className="settings-select"
            >
              <option value="INR">
                INR — ₹ Indian Rupee
              </option>

              <option value="USD">
                USD — $ US Dollar
              </option>

              <option value="EUR">
                EUR — € Euro
              </option>
            </select>

          </div>


          {/* Notifications */}

          <div className="settings-option">

            <div className="settings-option-left">

              <div className="settings-option-icon">
                <Bell size={18} />
              </div>

              <div>
                <strong>Notifications</strong>

                <span>
                  Receive useful updates and reminders.
                </span>
              </div>

            </div>


            <button
              type="button"
              className={`settings-toggle ${
                notifications ? "active" : ""
              }`}
              onClick={() =>
                setNotifications(!notifications)
              }
              aria-label="Toggle notifications"
            >
              <span />
            </button>

          </div>


          {/* Theme */}

          <div className="settings-option">

            <div className="settings-option-left">

              <div className="settings-option-icon">
                <Palette size={18} />
              </div>

              <div>
                <strong>Dark Mode</strong>

                <span>
                  Use a darker appearance for the app.
                </span>
              </div>

            </div>


            <button
              type="button"
              className={`settings-toggle ${
                darkMode ? "active" : ""
              }`}
              onClick={() =>
                setDarkMode(!darkMode)
              }
              aria-label="Toggle dark mode"
            >
              <span />
            </button>

          </div>

        </section>


        {/* =========================================
            DANGER ZONE
        ========================================= */}

        <section className="settings-card danger-card">

          <div className="settings-card-header">

            <div className="settings-section-icon danger-icon">
              <Trash2 size={20} />
            </div>

            <div>
              <h2>Danger Zone</h2>

              <p>
                Actions here can affect your account.
              </p>
            </div>

          </div>


          <div className="settings-option">

            <div className="settings-option-left">

              <div className="settings-option-icon logout-option-icon">
                <LogOut size={18} />
              </div>

              <div>
                <strong>Log Out</strong>

                <span>
                  Sign out of your SpendWise account.
                </span>
              </div>

            </div>


            <button
              className="settings-danger-button"
              onClick={handleLogout}
            >
              Log Out
            </button>

          </div>


          <div className="settings-option">

            <div className="settings-option-left">

              <div className="settings-option-icon delete-option-icon">
                <Trash2 size={18} />
              </div>

              <div>
                <strong>Delete Account</strong>

                <span>
                  Permanently remove your SpendWise
                  account and data.
                </span>
              </div>

            </div>


            <button className="settings-delete-button">
              Delete Account
            </button>

          </div>

        </section>


        <div className="settings-footer">
          SpendWise · Know where your money goes.
        </div>

      </section>

    </main>
  );
}

export default Settings;