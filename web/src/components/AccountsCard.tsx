import {
  Plus,
  ArrowUpRight,
} from "lucide-react";

import "./AccountsCard.css";

function AccountsCard() {
  return (
    <article className="accounts-card">

      {/* Header */}
      <div className="accounts-card-header">

        <div>
          <h3>Your Money</h3>

          <p>
            Accounts & balances
          </p>
        </div>

        <button className="accounts-add-button">
          <Plus size={16} />
        </button>

      </div>


      {/* Accounts */}
      <div className="accounts-list">

        {/* Cash */}
        <div className="account-row">

          <div className="account-left">

            <div className="account-icon cash">
              ₹
            </div>

            <div>
              <strong>Cash</strong>
              <span>Physical money</span>
            </div>

          </div>

          <strong>
            ₹5,000
          </strong>

        </div>


        {/* Bank */}
        <div className="account-row">

          <div className="account-left">

            <div className="account-icon bank">
              🏦
            </div>

            <div>
              <strong>Bank Account</strong>
              <span>Primary account</span>
            </div>

          </div>

          <strong>
            ₹35,420
          </strong>

        </div>


        {/* Online Wallet */}
        <div className="account-row">

          <div className="account-left">

            <div className="account-icon wallet">
              💳
            </div>

            <div>
              <strong>Online Wallet</strong>
              <span>Digital money</span>
            </div>

          </div>

          <strong>
            ₹12,000
          </strong>

        </div>


        {/* Savings */}
        <div className="account-row">

          <div className="account-left">

            <div className="account-icon savings">
              🎯
            </div>

            <div>
              <strong>Savings Account</strong>
              <span>Long-term savings</span>
            </div>

          </div>

          <strong>
            ₹23,000
          </strong>

        </div>

      </div>


      {/* View all */}
      <button className="view-all-accounts">

        <span>
          View all accounts
        </span>

        <ArrowUpRight size={15} />

      </button>

    </article>
  );
}

export default AccountsCard;