import "./RecentTransactions.css";

function RecentTransactions() {
  return (
    <article className="transactions-card">

      {/* Header */}
      <div className="transactions-card-header">

        <div>
          <h3>Recent Transactions</h3>

          <p>
            Your latest activity
          </p>
        </div>

        <button className="view-transactions-button">
          View all
        </button>

      </div>


      {/* Transactions */}
      <div className="transactions-list">

        {/* Food */}
        <div className="transaction-row">

          <div className="transaction-left">

            <div className="transaction-icon food">
              🍔
            </div>

            <div>
              <strong>Food & Dining</strong>
              <span>Today · 1:20 PM</span>
            </div>

          </div>

          <strong className="transaction-expense">
            -₹250
          </strong>

        </div>


        {/* Transport */}
        <div className="transaction-row">

          <div className="transaction-left">

            <div className="transaction-icon transport">
              🚕
            </div>

            <div>
              <strong>Transport</strong>
              <span>Today · 10:15 AM</span>
            </div>

          </div>

          <strong className="transaction-expense">
            -₹120
          </strong>

        </div>


        {/* Salary */}
        <div className="transaction-row">

          <div className="transaction-left">

            <div className="transaction-icon salary">
              💼
            </div>

            <div>
              <strong>Salary</strong>
              <span>Yesterday · 9:00 AM</span>
            </div>

          </div>

          <strong className="transaction-income">
            +₹35,000
          </strong>

        </div>


        {/* Shopping */}
        <div className="transaction-row">

          <div className="transaction-left">

            <div className="transaction-icon shopping">
              🛍️
            </div>

            <div>
              <strong>Shopping</strong>
              <span>Yesterday · 6:40 PM</span>
            </div>

          </div>

          <strong className="transaction-expense">
            -₹850
          </strong>

        </div>

      </div>

    </article>
  );
}

export default RecentTransactions;