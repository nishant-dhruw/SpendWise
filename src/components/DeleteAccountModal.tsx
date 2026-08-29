import { Trash2, X } from "lucide-react";

import "./DeleteAccountModal.css";

interface Account {
  name: string;
  type: string;
  balance: number;
}

interface DeleteAccountModalProps {
  account: Account;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteAccountModal({
  account,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {

  return (
    <div className="delete-account-overlay">

      <div className="delete-account-modal">

        {/* Close */}
        <button
          className="delete-account-close"
          onClick={onClose}
        >
          <X size={20} />
        </button>


        {/* Icon */}
        <div className="delete-account-icon">
          <Trash2 size={28} />
        </div>


        {/* Heading */}
        <h2>
          Delete Account?
        </h2>

        <p className="delete-account-subtitle">
          Are you sure you want to delete this account?
        </p>


        {/* Account information */}
        <div className="delete-account-info">

          <div>
            <strong>
              {account.name}
            </strong>

            <span>
              {account.type === "cash" && "Physical money"}
              {account.type === "bank" && "Bank account"}
              {account.type === "wallet" && "Digital money"}
              {account.type === "savings" && "Long-term savings"}
            </span>
          </div>

          <strong className="delete-account-balance">
            ₹{account.balance.toLocaleString("en-IN")}
          </strong>

        </div>


        {/* Warning */}
        <p className="delete-account-warning">
          This account will be permanently removed from your
          SpendWise dashboard.
        </p>


        {/* Buttons */}
        <div className="delete-account-actions">

          <button
            className="delete-account-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="delete-account-confirm"
            onClick={onConfirm}
          >
            Delete Account
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteAccountModal;