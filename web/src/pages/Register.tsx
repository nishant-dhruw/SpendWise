import { useState } from "react";
import { Link } from "react-router-dom";
import {
  WalletCards,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="register-page">

      {/* Decorative background */}
      <div className="register-orb register-orb-one"></div>
      <div className="register-orb register-orb-two"></div>

      <div className="register-layout">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <section className="register-hero">

          <div className="register-brand">

            <div className="register-logo">
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


          <div className="register-hero-content">

            <div className="register-badge">
              START YOUR FINANCIAL JOURNEY
            </div>

            <h2>
              Build better
              <span>money habits.</span>
            </h2>

            <p>
              Create your SpendWise account and bring your
              income, expenses, accounts, budgets, and goals
              together in one place.
            </p>


            <div className="register-benefits">

              <div>
                <div className="benefit-icon">
                  <Check size={16} />
                </div>

                <span>
                  Track income and expenses
                </span>
              </div>

              <div>
                <div className="benefit-icon">
                  <Check size={16} />
                </div>

                <span>
                  Manage multiple accounts
                </span>
              </div>

              <div>
                <div className="benefit-icon">
                  <Check size={16} />
                </div>

                <span>
                  Set budgets and savings goals
                </span>
              </div>

              <div>
                <div className="benefit-icon">
                  <Check size={16} />
                </div>

                <span>
                  Understand your spending
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <section className="register-section">

          <div className="register-card">

            {/* Mobile brand */}

            <div className="register-mobile-brand">

              <div className="register-mobile-logo">
                <WalletCards size={22} />
              </div>

              <div>
                <strong>SpendWise</strong>

                <span>
                  Know where your money goes.
                </span>
              </div>

            </div>


            {/* Header */}

            <div className="register-card-header">

              <div className="register-card-icon">
                <UserRound size={24} />
              </div>

              <h2>
                Create your account
              </h2>

              <p>
                Start taking control of your finances.
              </p>

            </div>


            {/* Form */}

            <form className="register-form">

              {/* Full name */}

              <div className="register-form-group">

                <label htmlFor="name">
                  Full name
                </label>

                <div className="register-input-wrapper">

                  <UserRound
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />

                </div>

              </div>


              {/* Email */}

              <div className="register-form-group">

                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="register-input-wrapper">

                  <Mail
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* Password */}

              <div className="register-form-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="register-input-wrapper">

                  <LockKeyhole
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              {/* Confirm password */}

              <div className="register-form-group">

                <label htmlFor="confirm-password">
                  Confirm password
                </label>

                <div className="register-input-wrapper">

                  <LockKeyhole
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              {/* Terms */}

              <label className="terms-option">

                <input type="checkbox" />

                <span>
                  I agree to the SpendWise terms and
                  privacy policy.
                </span>

              </label>


              {/* Create account */}

              <button
                type="submit"
                className="register-button"
              >

                <span>
                  Create account
                </span>

                <ArrowRight size={18} />

              </button>

            </form>


            {/* Privacy */}

            <div className="register-security">

              <ShieldCheck size={16} />

              <span>
                Your financial information stays private.
              </span>

            </div>


            {/* Login */}

            <div className="login-existing">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>

            </div>

          </div>


          <p className="register-footer">
            © 2026 SpendWise. All rights reserved.
          </p>

        </section>

      </div>

    </main>
  );
}

export default Register;