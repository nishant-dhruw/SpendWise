import "./RecentTransactions.css";

import { useState } from "react";

import {
  Trash2,
  Pencil,
} from "lucide-react";

import AddTransactionModal from "./AddTransactionModal";

import { useNavigate } from "react-router-dom";



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

  onAddTransaction:
    (transaction: Transaction) => void;

  onDeleteTransaction:
    (transaction: Transaction) => void;


  onEditTransaction: (

    oldTransaction: Transaction,

    updatedTransaction: Transaction

  ) => void;


  accounts: Account[];

}



function RecentTransactions({

  transactions,

  onAddTransaction,

  onDeleteTransaction,

  onEditTransaction,

  accounts,

}: RecentTransactionsProps) {


  const navigate =
    useNavigate();



  // =====================================================
  // MODAL STATES
  // =====================================================

  const [
    showAddTransaction,
    setShowAddTransaction,
  ] =
    useState(false);



  const [
    transactionToDelete,
    setTransactionToDelete,
  ] =
    useState<Transaction | null>(
      null
    );



  const [
    transactionToEdit,
    setTransactionToEdit,
  ] =
    useState<Transaction | null>(
      null
    );



  return (

    <article className="transactions-card">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="transactions-card-header">


        <div>

          <h3>
            Recent Transactions
          </h3>


          <p>
            Your latest activity
          </p>

        </div>



        <div className="transactions-header-actions">


          {/* ADD BUTTON */}

          <button
            className="add-transaction-button"
            onClick={() =>
              setShowAddTransaction(
                true
              )
            }
          >

            + Add

          </button>



          {/* VIEW ALL BUTTON */}

          <button
            className="view-transactions-button"
            onClick={() =>
              navigate(
                "/transactions"
              )
            }
          >

            View all

          </button>


        </div>


      </div>



      {/* =================================================
          TRANSACTION LIST
      ================================================= */}

      <div className="transactions-list">


        {transactions.map(

          (transaction) => (

            <div
              className="transaction-row"
              key={transaction.id}
            >


              {/* LEFT SIDE */}

              <div className="transaction-left">


                <div
                  className={
                    `transaction-icon ${transaction.category}`
                  }
                >

                  {transaction.category ===
                    "food" &&
                    "🍔"}

                  {transaction.category ===
                    "transport" &&
                    "🚕"}

                  {transaction.category ===
                    "shopping" &&
                    "🛍️"}

                  {transaction.category ===
                    "salary" &&
                    "💼"}

                  {transaction.category ===
                    "bills" &&
                    "💡"}

                  {transaction.category ===
                    "entertainment" &&
                    "🎮"}

                  {transaction.category ===
                    "health" &&
                    "🏥"}

                  {transaction.category ===
                    "freelance" &&
                    "💻"}

                  {transaction.category ===
                    "other" &&
                    "💰"}

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



              {/* RIGHT SIDE */}

              <div className="transaction-right">


                {/* AMOUNT */}

                <strong

                  className={

                    transaction.type ===
                    "income"

                      ? "transaction-income"

                      : "transaction-expense"

                  }

                >

                  {transaction.type ===
                  "income"

                    ? "+"

                    : "-"}

                  ₹{
                    transaction.amount.toLocaleString(
                      "en-IN"
                    )
                  }

                </strong>



                {/* EDIT BUTTON */}

                <button

                  className="edit-transaction-button"

                  onClick={() =>
                    setTransactionToEdit(
                      transaction
                    )
                  }

                  title="Edit transaction"

                >

                  <Pencil
                    size={14}
                  />

                </button>



                {/* DELETE BUTTON */}

                <button

                  className="delete-transaction-button"

                  onClick={() =>
                    setTransactionToDelete(
                      transaction
                    )
                  }

                  title="Delete transaction"

                >

                  <Trash2
                    size={14}
                  />

                </button>


              </div>


            </div>

          )

        )}


      </div>



      {/* =================================================
          ADD TRANSACTION MODAL
      ================================================= */}

      {showAddTransaction && (

        <AddTransactionModal

          onClose={() =>
            setShowAddTransaction(
              false
            )
          }

          onAddTransaction={
            onAddTransaction
          }

          accounts={
            accounts
          }

        />

      )}



      {/* =================================================
          EDIT TRANSACTION MODAL
      ================================================= */}

      {transactionToEdit && (

        <AddTransactionModal

          onClose={() =>
            setTransactionToEdit(
              null
            )
          }

          onAddTransaction={
            onAddTransaction
          }

          onEditTransaction={
            onEditTransaction
          }

          transactionToEdit={
            transactionToEdit
          }

          accounts={
            accounts
          }

        />

      )}



      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {transactionToDelete && (

        <div

          className="delete-confirm-overlay"

          onClick={() =>
            setTransactionToDelete(
              null
            )
          }

        >


          <div

            className="delete-confirm-modal"

            onClick={(e) =>
              e.stopPropagation()
            }

          >


            <div className="delete-confirm-icon">

              <Trash2
                size={22}
              />

            </div>



            <h3>
              Delete Transaction?
            </h3>



            <p>
              Are you sure you want to delete this transaction?
            </p>



            <div className="delete-confirm-details">


              <strong>
                {
                  transactionToDelete.description
                }
              </strong>



              <span

                className={

                  transactionToDelete.type ===
                  "income"

                    ? "transaction-income"

                    : "transaction-expense"

                }

              >

                {transactionToDelete.type ===
                "income"

                  ? "+"

                  : "-"}

                ₹{
                  transactionToDelete.amount.toLocaleString(
                    "en-IN"
                  )
                }

              </span>


            </div>



            <p className="delete-confirm-note">

              This will update the balance of{" "}

              <strong>

                {
                  transactionToDelete.accountName
                }

              </strong>.

            </p>



            <div className="delete-confirm-actions">


              <button

                className="delete-cancel-button"

                onClick={() =>
                  setTransactionToDelete(
                    null
                  )
                }

              >

                Cancel

              </button>



              <button

                className="delete-confirm-button"

                onClick={() => {

                  onDeleteTransaction(
                    transactionToDelete
                  );


                  setTransactionToDelete(
                    null
                  );

                }}

              >

                Delete

              </button>


            </div>


          </div>


        </div>

      )}


    </article>

  );

}


export default RecentTransactions;