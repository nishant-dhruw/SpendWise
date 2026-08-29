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

interface EditTransactionModalProps {
  transaction: Transaction;
  accounts: Account[];
  onClose: () => void;
  onSaveTransaction: (transaction: Transaction) => void;
}

function EditTransactionModal({
  transaction,
  accounts,
  onClose,
  onSaveTransaction,
}: EditTransactionModalProps) {

  const [type, setType] =
    useState<"income" | "expense">(transaction.type);

  const [category, setCategory] =
    useState(transaction.category);

  const [description, setDescription] =
    useState(transaction.description);

  const [amount, setAmount] =
    useState(String(transaction.amount));

  const [date, setDate] =
    useState(transaction.date);

  const [accountName, setAccountName] =
    useState(transaction.accountName);

  const [showAlert, setShowAlert] =
    useState(false);

  const [alertTitle, setAlertTitle] =
    useState("");

  const [alertMessage, setAlertMessage] =
    useState("");


  const showError = (
    title: string,
    message: string
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };


  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    // ================= VALIDATION =================

    if (!category) {

      showError(
        "Category Required",
        "Please select a category before saving the transaction."
      );

      return;
    }


    if (!description.trim()) {

      showError(
        "Description Required",
        "Please enter a description for this transaction."
      );

      return;
    }


    if (!amount || Number(amount) <= 0) {

      showError(
        "Invalid Amount",
        "Please enter a valid amount greater than ₹0."
      );

      return;
    }


    // ================= BALANCE CHECK =================

    /*
      The old transaction is still affecting
      the account balance.

      We first remove the old transaction's
      effect, then apply the new transaction.
    */

    const oldAccount = accounts.find(
      (account) =>
        account.name === transaction.accountName
    );


    let availableBalance =
      oldAccount?.balance ?? 0;


    // Remove old transaction effect

    if (transaction.type === "income") {

      availableBalance -= transaction.amount;

    } else {

      availableBalance += transaction.amount;

    }


    // Check new expense

    if (type === "expense") {

      const selectedAccount = accounts.find(
        (account) =>
          account.name === accountName
      );


      if (selectedAccount) {

        /*
          If the account is the same account,
          availableBalance already contains
          the restored old transaction.

          If it is a different account,
          use its current balance.
        */

        const balanceToCheck =
          transaction.accountName === accountName
            ? availableBalance
            : selectedAccount.balance;


        if (
          Number(amount) > balanceToCheck
        ) {

          showError(
            "Insufficient Balance",
            `You don't have enough money in ${selectedAccount.name}. Available balance: ₹${balanceToCheck.toLocaleString("en-IN")}.`
          );

          return;
        }

      }

    }


    // ================= UPDATED TRANSACTION =================

    const updatedTransaction: Transaction = {

      id: transaction.id,

      type,

      category,

      description:
        description.trim(),

      amount:
        Number(amount),

      date,

      accountName,

    };


    onSaveTransaction(
      updatedTransaction
    );

    onClose();

  };


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

        {/* ================= HEADER ================= */}

        <div className="transaction-modal-header">

          <div>

            <h2>
              Edit Transaction
            </h2>

            <p>
              Update your income or expense.
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


        {/* ================= FORM ================= */}

        <form
          className="transaction-form"
          onSubmit={handleSubmit}
        >

          {/* ================= TYPE ================= */}

          <div className="transaction-form-group">

            <label>
              Transaction type
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


          {/* ================= CATEGORY ================= */}

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

              <option value="" disabled>
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


          {/* ================= DESCRIPTION ================= */}

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


          {/* ================= AMOUNT ================= */}

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
                min="0"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* ================= ACCOUNT ================= */}

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
                    key={account.name}
                    value={account.name}
                  >
                    {account.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ================= DATE ================= */}

          <div className="transaction-form-group">

            <label>
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
            />

          </div>


          {/* ================= BUTTONS ================= */}

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
              Save Changes
            </button>

          </div>

        </form>

      </div>


      {/* ================= ALERT ================= */}

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

export default EditTransactionModal;