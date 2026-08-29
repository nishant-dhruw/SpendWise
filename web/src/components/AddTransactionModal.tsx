import { X } from "lucide-react";
import { useState } from "react";

import "./AddTransactionModal.css";
import AlertModal from "./AlertModal";


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


interface AddTransactionModalProps {
  onClose: () => void;

  onAddTransaction:
    (transaction: Transaction) => void;

  onEditTransaction?: (
    oldTransaction: Transaction,
    updatedTransaction: Transaction
  ) => void;

  transactionToEdit?: Transaction | null;

  accounts: Account[];
}


// =========================================================
// GET TODAY'S DATE IN LOCAL FORMAT
// =========================================================

const getTodayDate = () => {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;

};


// =========================================================
// COMPONENT
// =========================================================

function AddTransactionModal({

  onClose,

  onAddTransaction,

  onEditTransaction,

  transactionToEdit,

  accounts,

}: AddTransactionModalProps) {


  // =========================================================
  // FORM STATE
  // =========================================================

  const [type, setType] =
    useState<"income" | "expense">(
      transactionToEdit?.type ||
      "expense"
    );


  const [category, setCategory] =
    useState(
      transactionToEdit?.category ||
      ""
    );


  const [description, setDescription] =
    useState(
      transactionToEdit?.description ||
      ""
    );


  const [amount, setAmount] =
    useState(
      transactionToEdit
        ? String(
            transactionToEdit.amount
          )
        : ""
    );


  const [date, setDate] =
    useState(
      transactionToEdit?.date ||
      getTodayDate()
    );


  const [accountName, setAccountName] =
    useState(
      transactionToEdit?.accountName ||
      accounts[0]?.name ||
      ""
    );


  // =========================================================
  // ALERT STATE
  // =========================================================

  const [showAlert, setShowAlert] =
    useState(false);


  const [alertTitle, setAlertTitle] =
    useState("");


  const [alertMessage, setAlertMessage] =
    useState("");


  // =========================================================
  // SHOW ERROR
  // =========================================================

  const showError = (
    title: string,
    message: string
  ) => {

    setAlertTitle(title);

    setAlertMessage(message);

    setShowAlert(true);

  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    // =========================================================
    // VALIDATE CATEGORY
    // =========================================================

    if (!category) {

      showError(
        "Category Required",
        "Please select a category before saving the transaction."
      );

      return;

    }


    // =========================================================
    // VALIDATE DESCRIPTION
    // =========================================================

    if (!description.trim()) {

      showError(
        "Description Required",
        "Please enter a description for this transaction."
      );

      return;

    }


    // =========================================================
    // VALIDATE AMOUNT
    // =========================================================

    if (
      !amount ||
      !Number.isFinite(
        Number(amount)
      ) ||
      Number(amount) <= 0
    ) {

      showError(
        "Invalid Amount",
        "Please enter a valid amount greater than ₹0."
      );

      return;

    }


    // =========================================================
    // VALIDATE ACCOUNT
    // =========================================================

    if (!accountName) {

      showError(
        "Account Required",
        "Please select an account for this transaction."
      );

      return;

    }


    // =========================================================
    // VALIDATE DATE
    // =========================================================

    if (!date) {

      showError(
        "Date Required",
        "Please select a transaction date."
      );

      return;

    }


    // =========================================================
    // CHECK ACCOUNT BALANCE
    // =========================================================

    if (type === "expense") {

      const selectedAccount =
        accounts.find(
          (account) =>
            account.name ===
            accountName
        );


      let availableBalance =
        selectedAccount?.balance || 0;


      // =====================================================
      // EDITING TRANSACTION
      //
      // Restore the old transaction effect when the old
      // transaction belongs to the same account.
      // =====================================================

      if (
        transactionToEdit &&
        transactionToEdit.accountName ===
          accountName
      ) {

        if (
          transactionToEdit.type ===
          "expense"
        ) {

          availableBalance +=
            transactionToEdit.amount;

        } else {

          availableBalance -=
            transactionToEdit.amount;

        }

      }


      if (
        selectedAccount &&
        Number(amount) >
          availableBalance
      ) {

        showError(
          "Insufficient Balance",
          `You don't have enough money in ${selectedAccount.name}. Available balance: ₹${availableBalance.toLocaleString(
            "en-IN"
          )}.`
        );

        return;

      }

    }


    // =========================================================
    // CREATE UPDATED TRANSACTION
    // =========================================================

    const updatedTransaction:
      Transaction = {

      // Keep the same ID when editing
      id:
        transactionToEdit?.id ||
        Date.now(),

      type,

      category,

      description:
        description.trim(),

      amount:
        Number(amount),

      // Stored consistently as YYYY-MM-DD
      date,

      accountName,

    };


    // =========================================================
    // SAVE TRANSACTION
    // =========================================================

    if (
      transactionToEdit &&
      onEditTransaction
    ) {

      onEditTransaction(
        transactionToEdit,
        updatedTransaction
      );

    } else {

      onAddTransaction(
        updatedTransaction
      );

    }


    onClose();

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div
      className="transaction-modal-overlay"
      onClick={onClose}
    >

      <div
        className="add-transaction-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="transaction-modal-header">

          <div>

            <h2>

              {transactionToEdit
                ? "Edit Transaction"
                : "Add Transaction"}

            </h2>


            <p>

              {transactionToEdit
                ? "Update your transaction details."
                : "Record your income or expense."}

            </p>

          </div>


          <button
            className="transaction-modal-close"
            onClick={onClose}
            aria-label="Close"
          >

            <X size={18} />

          </button>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="transaction-form"
          onSubmit={handleSubmit}
        >


          {/* TRANSACTION TYPE */}

          <div className="transaction-form-group">

            <label>
              Transaction Type
            </label>


            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "income"
                    | "expense"
                )
              }
            >

              <option value="expense">
                Expense
              </option>


              <option value="income">
                Income
              </option>

            </select>

          </div>


          {/* CATEGORY */}

          <div className="transaction-form-group">

            <label>
              Category
            </label>


            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option
                value=""
                disabled
              >
                Select category
              </option>


              <option value="food">
                Food & Dining
              </option>


              <option value="transport">
                Transport
              </option>


              <option value="shopping">
                Shopping
              </option>


              <option value="bills">
                Bills & Utilities
              </option>


              <option value="entertainment">
                Entertainment
              </option>


              <option value="health">
                Health
              </option>


              <option value="salary">
                Salary
              </option>


              <option value="freelance">
                Freelance
              </option>


              <option value="other">
                Other
              </option>

            </select>

          </div>


          {/* DESCRIPTION */}

          <div className="transaction-form-group">

            <label>
              Description
            </label>


            <input
              type="text"
              placeholder="e.g. Lunch at restaurant"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>


          {/* AMOUNT */}

          <div className="transaction-form-group">

            <label>
              Amount
            </label>


            <div className="transaction-amount-input">

              <span>
                ₹
              </span>


              <input
                type="number"
                placeholder="0"
                min="1"
                step="1"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* ACCOUNT */}

          <div className="transaction-form-group">

            <label>
              Account
            </label>


            <select
              value={accountName}
              onChange={(e) =>
                setAccountName(
                  e.target.value
                )
              }
            >

              <option
                value=""
                disabled
              >
                Select account
              </option>


              {accounts.map(
                (account) => (

                  <option
                    key={
                      account.name
                    }
                    value={
                      account.name
                    }
                  >

                    {account.name}

                  </option>

                )
              )}

            </select>

          </div>


          {/* DATE */}

          <div className="transaction-form-group">

            <label>
              Date
            </label>


            <input
              type="date"
              value={date}
              max={getTodayDate()}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
            />

          </div>


          {/* ACTIONS */}

          <div className="transaction-modal-actions">

            <button
              type="button"
              className="transaction-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="transaction-add-button"
            >

              {transactionToEdit
                ? "Save Changes"
                : "Add Transaction"}

            </button>

          </div>

        </form>

      </div>


      {/* =================================================
          ALERT
      ================================================= */}

      {showAlert && (

        <AlertModal
          title={alertTitle}
          message={alertMessage}
          onClose={() => {

            setShowAlert(false);

            setAlertTitle("");

            setAlertMessage("");

          }}
        />

      )}

    </div>

  );

}


export default AddTransactionModal;