import { useState } from "react";
import { X } from "lucide-react";
import "./AddAccountModal.css";

interface AddAccountModalProps {
  onClose: () => void;
  onAddAccount: (account: {
    name: string;
    type: string;
    balance: number;
  }) => void;
}
function AddAccountModal({
  onClose,
  onAddAccount,
}: AddAccountModalProps)  {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [balance, setBalance] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate account name
    if (!accountName.trim()) {
      setError("Please enter an account name.");
      return;
    }

    // Validate account type
    if (!accountType) {
      setError("Please select an account type.");
      return;
    }

    // Validate balance
    if (balance === "" || Number(balance) < 0) {
      setError("Please enter a valid balance.");
      return;
    }

    // For now, just confirm the data
    const newAccount = {
        name: accountName.trim(),
        type: accountType,
        balance: Number(balance),
        };

        onAddAccount(newAccount);

        setError("");

        onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div
        className="add-account-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="modal-header">

          <div>
            <h2>Add Account</h2>

            <p>
              Add a new account to track your money.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>

        </div>


        {/* Form */}
        <form
          className="account-form"
          onSubmit={handleSubmit}
        >

          {/* Account Name */}
          <div className="form-group">

            <label>
              Account name
            </label>

            <input
              type="text"
              placeholder="e.g. HDFC Bank"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                setError("");
              }}
            />

          </div>


          {/* Account Type */}
          <div className="form-group">

            <label>
              Account type
            </label>

            <select
              value={accountType}
              onChange={(e) => {
                setAccountType(e.target.value);
                setError("");
              }}
            >

              <option value="" disabled>
                Select account type
              </option>

              <option value="cash">
                Cash
              </option>

              <option value="bank">
                Bank Account
              </option>

              <option value="wallet">
                Online Wallet
              </option>

              <option value="savings">
                Savings Account
              </option>

            </select>

          </div>


          {/* Balance */}
          <div className="form-group">

            <label>
              Current balance
            </label>

            <div className="amount-input">

              <span>₹</span>

              <input
                type="number"
                placeholder="0"
                min="0"
                value={balance}
                onChange={(e) => {
                  setBalance(e.target.value);
                  setError("");
                }}
              />

            </div>

          </div>


          {/* Error */}
          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          {/* Buttons */}
          <div className="modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-account-button"
            >
              Add Account
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddAccountModal;