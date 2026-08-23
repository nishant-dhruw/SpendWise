import "./RecentTransactions.css";
import { useState } from "react";
import AddTransactionModal from "./AddTransactionModal";

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  accountName: string;
}

interface Account {
  name: string;
  type: string;
  balance: number;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  accounts: Account[];
}

function RecentTransactions({
  transactions,
  onAddTransaction,
  accounts,
}: RecentTransactionsProps) {
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  return (
    <article className="transactions-card">

      <div className="transactions-card-header">

        <div>
          <h3>Recent Transactions</h3>

          <p>
            Your latest activity
          </p>
        </div>

        <div className="transactions-header-actions">

          <button
            className="add-transaction-button"
            onClick={() => setShowAddTransaction(true)}
          >
            + Add
          </button>

          <button className="view-transactions-button">
            View all
          </button>

        </div>

      </div>


      <div className="transactions-list">

        {transactions.map((transaction) => (

          <div
            className="transaction-row"
            key={transaction.id}
          >

            <div className="transaction-left">

              <div
                className={`transaction-icon ${transaction.category}`}
              >
                {transaction.category === "food" && "🍔"}
                {transaction.category === "transport" && "🚕"}
                {transaction.category === "shopping" && "🛍️"}
                {transaction.category === "salary" && "💼"}
                {transaction.category === "bills" && "💡"}
                {transaction.category === "entertainment" && "🎮"}
                {transaction.category === "health" && "🏥"}
                {transaction.category === "freelance" && "💻"}
                {transaction.category === "other" && "💰"}
              </div>

              <div>

                <strong>
                  {transaction.description}
                </strong>

                <span>
                  {transaction.date}
                </span>

              </div>

            </div>


            <strong
              className={
                transaction.type === "income"
                  ? "transaction-income"
                  : "transaction-expense"
              }
            >
              {transaction.type === "income" ? "+" : "-"}
              ₹{transaction.amount.toLocaleString("en-IN")}
            </strong>

          </div>

        ))}

      </div>
      {showAddTransaction && (
        <AddTransactionModal
          onClose={() => setShowAddTransaction(false)}
          onAddTransaction={onAddTransaction}
          accounts={accounts}
        />
      )}

    </article>
  );
}

export default RecentTransactions;