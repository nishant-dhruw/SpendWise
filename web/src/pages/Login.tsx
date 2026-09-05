import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  WalletCards,
  TrendingUp,
  Target,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  PieChart,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  MoreHorizontal,
} from "lucide-react";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Remember me
  const [rememberMe, setRememberMe] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // =====================================================
  // LOGIN HANDLER
  // =====================================================

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // LOGIN API REQUEST
      // =====================================================

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      // Get response data
      const data = await response.json();

      // =====================================================
      // LOGIN FAILED
      // =====================================================

      if (!response.ok) {
        setError(
          data.message ||
            "Login failed. Please check your email and password."
        );

        return;
      }

      // =====================================================
      // CHECK TOKEN
      // =====================================================

      if (!data.token) {
        setError(
          "Login was successful, but no authentication token was received."
        );

        return;
      }

      // =====================================================
      // SAVE AUTHENTICATION DATA
      // =====================================================

      if (rememberMe) {

        // Persistent login

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Remove old session token if it exists

        sessionStorage.removeItem(
          "token"
        );

        sessionStorage.removeItem(
          "user"
        );

      } else {

        // Login only for current browser session

        sessionStorage.setItem(
          "token",
          data.token
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Remove old persistent token if it exists

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

      }

      console.log(
        "Login successful:",
        data
      );

      // =====================================================
      // REDIRECT TO DASHBOARD
      // =====================================================

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the backend server is running."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <main className="login-page">

      {/* Decorative background */}

      <div className="decorative-orb orb-top-left"></div>

      <div className="decorative-orb orb-bottom-right"></div>

      <div className="decorative-dots dots-one"></div>

      <div className="decorative-dots dots-two"></div>


      <div className="login-layout">


        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <section className="login-hero">


          {/* Brand */}

          <div className="hero-brand">

            <div className="hero-logo">
              <WalletCards size={28} />
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


          {/* Hero */}

          <div className="hero-content">

            <div className="hero-badge">
              PERSONAL FINANCE, SIMPLIFIED
            </div>


            <h2>
              Take control of
              <span>your finances.</span>
            </h2>


            <p className="hero-description">
              Track your spending, manage your money, set goals,
              and build better financial habits — all in one place.
            </p>


            {/* Features */}

            <div className="feature-grid">


              <div className="feature-item">

                <div className="feature-icon">
                  <TrendingUp size={20} />
                </div>

                <div>

                  <h3>
                    Track Expenses
                  </h3>

                  <p>
                    Know where every rupee goes.
                  </p>

                </div>

              </div>


              <div className="feature-item">

                <div className="feature-icon">
                  <WalletCards size={20} />
                </div>

                <div>

                  <h3>
                    Manage Your Money
                  </h3>

                  <p>
                    Keep all your accounts in one place.
                  </p>

                </div>

              </div>


              <div className="feature-item">

                <div className="feature-icon">
                  <Target size={20} />
                </div>

                <div>

                  <h3>
                    Achieve Your Goals
                  </h3>

                  <p>
                    Save today for what matters tomorrow.
                  </p>

                </div>

              </div>


              <div className="feature-item">

                <div className="feature-icon">
                  <BarChart3 size={20} />
                </div>

                <div>

                  <h3>
                    Understand Spending
                  </h3>

                  <p>
                    Turn your data into useful insights.
                  </p>

                </div>

              </div>

            </div>


            {/* Finance Preview */}

            <div className="finance-preview">


              {/* Monthly Chart */}

              <div className="preview-card spending-card">

                <div className="preview-header">

                  <div>

                    <span>
                      Monthly overview
                    </span>

                    <strong>
                      ₹42,650
                    </strong>

                  </div>

                  <MoreHorizontal size={18} />

                </div>


                <p className="preview-label">
                  Total spending
                </p>


                <div className="line-chart">

                  <div className="chart-line"></div>


                  <div className="chart-bars">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                  </div>

                </div>

              </div>


              {/* Category Preview */}

              <div className="preview-card category-card">

                <div className="category-title">

                  <PieChart size={19} />

                  <span>
                    Spending by category
                  </span>

                </div>


                <div className="category-content">

                  <div className="donut-chart">

                    <div className="donut-hole">
                      100%
                    </div>

                  </div>


                  <div className="category-list">


                    <div>

                      <i className="dot food"></i>

                      <span>
                        Food
                      </span>

                      <strong>
                        ₹12,450
                      </strong>

                    </div>


                    <div>

                      <i className="dot transport"></i>

                      <span>
                        Transport
                      </span>

                      <strong>
                        ₹8,500
                      </strong>

                    </div>


                    <div>

                      <i className="dot shopping"></i>

                      <span>
                        Shopping
                      </span>

                      <strong>
                        ₹6,500
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>



        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <section className="login-section">

          <div className="login-card">


            {/* Mobile Brand */}

            <div className="mobile-brand">

              <div className="mobile-logo">
                <WalletCards size={23} />
              </div>


              <div>

                <strong>
                  SpendWise
                </strong>

                <span>
                  Know where your money goes.
                </span>

              </div>

            </div>


            {/* Login Icon */}

            <div className="login-icon-wrapper">

              <div className="login-icon-ring">

                <div className="login-card-icon">
                  <WalletCards size={25} />
                </div>

              </div>

            </div>


            {/* Heading */}

            <div className="login-card-header">

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to continue managing your finances.
              </p>

            </div>


            {/* =====================================================
                LOGIN FORM
            ===================================================== */}

            <form
              className="login-form"
              onSubmit={handleLogin}
            >


              {/* Error Message */}

              {error && (

                <div
                  style={{
                    color: "#dc2626",
                    fontSize: "13px",
                    marginBottom: "14px",
                    textAlign: "center",
                    padding: "10px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                  }}
                >
                  {error}
                </div>

              )}


              {/* Email */}

              <div className="form-group">

                <label htmlFor="email">
                  Email address
                </label>


                <div className="input-wrapper">

                  <Mail
                    size={18}
                    className="input-icon"
                  />


                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>



              {/* Password */}

              <div className="form-group">

                <div className="password-label">

                  <label htmlFor="password">
                    Password
                  </label>


                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>

                </div>


                <div className="input-wrapper">

                  <LockKeyhole
                    size={18}
                    className="input-icon"
                  />


                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />


                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>



              {/* Remember Me */}

              <label className="remember-option">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Remember me
                </span>

              </label>



              {/* Sign In Button */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                <span>

                  {loading
                    ? "Signing in..."
                    : "Sign in"}

                </span>


                {!loading && (
                  <ArrowRight size={19} />
                )}

              </button>

            </form>



            {/* Divider */}

            <div className="login-divider">

              <span>
                or
              </span>

            </div>



            {/* Security */}

            <div className="login-security">

              <ShieldCheck size={17} />

              <span>
                Your financial data stays private.
              </span>

            </div>



            {/* Register */}

            <div className="register-section">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create account
              </Link>

            </div>

          </div>


          {/* Footer */}

          <p className="login-footer">
            © 2026 SpendWise. All rights reserved.
          </p>

        </section>

      </div>

    </main>
  );
}

export default Login;