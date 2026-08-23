import { X } from "lucide-react";
import { useState } from "react";
import "./AddTransactionModal.css";

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
    onAddTransaction: (transaction: Transaction) => void;
    accounts: Account[];
}

function AddTransactionModal({
    onClose,
    onAddTransaction,
    accounts,
}: AddTransactionModalProps) {
    const [type, setType] = useState<"income" | "expense">("expense");

    const [category, setCategory] = useState("");

    const [description, setDescription] = useState("");

    const [amount, setAmount] = useState("");

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [accountName, setAccountName] = useState(
    accounts[0]?.name || ""
    );
    


const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (!category) {
    alert("Please select a category.");
    return;
    }

    if (!description.trim()) {
    alert("Please enter a description.");
    return;
    }

    if (!amount || Number(amount) <= 0) {
    alert("Please enter a valid amount.");
    return;
    }


    const newTransaction: Transaction = {
        id: Date.now(),
        type,
        category,
        description: description.trim(),
        amount: Number(amount),
        date,
        accountName,
        };


    onAddTransaction(newTransaction);

    onClose();
  };


  return (
    <div
      className="transaction-modal-overlay"
      onClick={onClose}
    >

      <div
        className="add-transaction-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}

        <div className="transaction-modal-header">

          <div>

            <h2>Add Transaction</h2>

            <p>
              Record your income or expense.
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


        {/* Form */}

        <form
          className="transaction-form"
          onSubmit={handleSubmit}
        >

          {/* Transaction Type */}

          <div className="transaction-form-group">

            <label>
              Transaction type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as "income" | "expense"
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


          {/* Category */}

          <div className="transaction-form-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
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


          {/* Description */}

          <div className="transaction-form-group">

            <label>
              Description
            </label>

            <input
              type="text"
              placeholder="e.g. Lunch at restaurant"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>


          {/* Amount */}

          <div className="transaction-form-group">

            <label>
              Amount
            </label>

            <div className="transaction-amount-input">

              <span>₹</span>

              <input
                type="number"
                placeholder="0"
                min="0"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />

            </div>

          </div>

          {/* Account */}

            <div className="transaction-form-group">

            <label>
                Account
            </label>

            <select
                value={accountName}
                onChange={(e) =>
                setAccountName(e.target.value)
                }
            >

                <option value="" disabled>
                Select account
                </option>

                {accounts.map((account) => (
                <option
                    key={account.name}
                    value={account.name}
                >
                    {account.name}
                </option>
                ))}

            </select>

            </div>


          {/* Date */}

          <div className="transaction-form-group">

            <label>
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>


          {/* Buttons */}

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
              Add Transaction
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddTransactionModal;