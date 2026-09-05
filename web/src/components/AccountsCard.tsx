import {
  Plus,
  ArrowUpRight,
  Trash2,
  Pencil,
  AlertTriangle,
  X,
  ReceiptText,
} from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import AddAccountModal from "./AddAccountModal";
import EditAccountModal from "./EditAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";

import "./AccountsCard.css";


// =====================================================
// ACCOUNT INTERFACE
// =====================================================

interface Account {
  _id?: string;
  name: string;
  type: string;
  balance: number;
}


// =====================================================
// TRANSACTION INTERFACE
// =====================================================

interface Transaction {
  id: string;

  type:
    | "income"
    | "expense";

  category: string;
  description: string;
  amount: number;
  date: string;
  accountName: string;
}


// =====================================================
// PROPS
// =====================================================

interface AccountsCardProps {
  accounts: Account[];

  // ===================================================
  // ADD ACCOUNT
  // ===================================================

  onAddAccount:
    (
      account: Account
    ) => Promise<void>;

  // ===================================================
  // ADD TRANSACTION
  //
  // Kept here so the existing Dashboard connection
  // continues to work.
  //
  // Account starting balance is NOT a transaction.
  // ===================================================

  onAddTransaction:
    (
      transaction: Transaction
    ) => Promise<void> | void;

  // ===================================================
  // EDIT ACCOUNT
  // ===================================================

  onEditAccount:
    (
      oldAccount: Account,
      updatedAccount: Account
    ) => Promise<void>;

  // ===================================================
  // DELETE ACCOUNT
  // ===================================================

  onDeleteAccount:
    (
      account: Account
    ) => Promise<void>;
}


// =====================================================
// COMPONENT
// =====================================================

function AccountsCard({
  accounts,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
}: AccountsCardProps) {

  const navigate = useNavigate();


  // =====================================================
  // MODAL STATES
  // =====================================================

  const [
    showAddAccount,
    setShowAddAccount,
  ] = useState(false);


  const [
    accountToDelete,
    setAccountToDelete,
  ] = useState<Account | null>(null);


  const [
    accountToEdit,
    setAccountToEdit,
  ] = useState<Account | null>(null);


  // =====================================================
  // ERROR MODAL STATE
  // =====================================================

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const [
    showErrorModal,
    setShowErrorModal,
  ] = useState(false);


  // =====================================================
  // SHOW ERROR MODAL
  // =====================================================

  const showError = (
    message: string
  ) => {

    setErrorMessage(message);

    setShowErrorModal(true);

  };


  // =====================================================
  // CLOSE ERROR MODAL
  // =====================================================

  const closeErrorModal = () => {

    setShowErrorModal(false);

    setErrorMessage("");

  };


  // =====================================================
  // ADD ACCOUNT
  // =====================================================

  const handleAddAccount =

    async (
      account: Account
    ) => {

      // =================================================
      // PREVENT DUPLICATE ACCOUNT NAME
      // =================================================

      const duplicateName =
        accounts.some(
          (currentAccount) =>
            currentAccount.name
              .trim()
              .toLowerCase()
            ===
            account.name
              .trim()
              .toLowerCase()
        );


      if (duplicateName) {

        showError(
          "An account with this name already exists. Please choose a different name."
        );

        return;

      }


      // =================================================
      // PREVENT DUPLICATE TYPE
      //
      // MULTIPLE BANK ACCOUNTS ARE ALLOWED
      // =================================================

      if (
        account.type !== "bank"
      ) {

        const duplicateType =
          accounts.some(
            (currentAccount) =>
              currentAccount.type ===
              account.type
          );


        if (duplicateType) {

          showError(
            "An account with this type already exists. You can have multiple bank accounts, but only one account of this type."
          );

          return;

        }

      }


      try {

        // =================================================
        // ADD ACCOUNT USING DASHBOARD FUNCTION
        // =================================================

        await onAddAccount(
          account
        );


        // =================================================
        // IMPORTANT
        //
        // The starting account balance is NOT an income
        // transaction.
        //
        // Example:
        //
        // SBI → ₹10,000
        //
        // This means the user already has ₹10,000.
        // It should increase the account balance only.
        //
        // No transaction is created here.
        // =================================================


        // =================================================
        // CLOSE ADD MODAL
        // =================================================

        setShowAddAccount(
          false
        );

      } catch (error) {

        console.error(
          "Error creating account:",
          error
        );


        showError(
          error instanceof Error
            ? error.message
            : "Unable to create the account. Please try again."
        );

      }

    };


  // =====================================================
  // EDIT ACCOUNT
  // =====================================================

  const handleEditAccount =

    async (
      oldAccount: Account,
      updatedAccount: Account
    ) => {

      try {

        // =================================================
        // EDIT ACCOUNT USING DASHBOARD FUNCTION
        // =================================================

        await onEditAccount(
          oldAccount,
          updatedAccount
        );


        // =================================================
        // CLOSE EDIT MODAL
        // =================================================

        setAccountToEdit(
          null
        );

      } catch (error) {

        console.error(
          "Error updating account:",
          error
        );


        showError(
          error instanceof Error
            ? error.message
            : "Unable to update the account. Please try again."
        );

      }

    };


  // =====================================================
  // OPEN DELETE MODAL
  // =====================================================

  const handleDeleteAccount = (
    account: Account
  ) => {

    setAccountToDelete(
      account
    );

  };


  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDeleteAccount =

    async () => {

      if (!accountToDelete) {
        return;
      }


      try {

        // =================================================
        // DELETE USING DASHBOARD FUNCTION
        // =================================================

        await onDeleteAccount(
          accountToDelete
        );


        // =================================================
        // DELETE SUCCESSFUL
        // =================================================

        setAccountToDelete(
          null
        );

      } catch (error) {

        console.error(
          "Error deleting account:",
          error
        );


        // =================================================
        // CLOSE DELETE CONFIRMATION MODAL
        // =================================================

        setAccountToDelete(
          null
        );


        // =================================================
        // SHOW BEAUTIFUL ERROR MODAL
        // =================================================

        showError(
          error instanceof Error
            ? error.message
            : "Unable to delete this account. Please try again."
        );

      }

    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <article className="accounts-card">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="accounts-card-header">

        <div>

          <h3>
            Your Money
          </h3>

          <p>
            Accounts & balances
          </p>

        </div>


        <button
          className="accounts-add-button"

          onClick={() =>
            setShowAddAccount(
              true
            )
          }

          title="Add account"
        >

          <Plus size={16} />

        </button>

      </div>


      {/* =================================================
          ACCOUNTS LIST
      ================================================= */}

      <div className="accounts-list">

        {accounts.length === 0 ? (

          <div className="accounts-empty">

            <p>
              No accounts yet.
            </p>

          </div>

        ) : (

          accounts.map(
            (
              account
            ) => (

              <div
                className="account-row"

                key={
                  account._id
                  ||
                  account.name
                }
              >


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="account-left">

                  <div
                    className={
                      `account-icon ${account.type}`
                    }
                  >

                    {account.type ===
                      "cash" &&
                      "₹"}

                    {account.type ===
                      "bank" &&
                      "🏦"}

                    {account.type ===
                      "wallet" &&
                      "💳"}

                    {account.type ===
                      "savings" &&
                      "🎯"}

                    {account.type ===
                      "other" &&
                      "💰"}

                  </div>


                  <div>

                    <strong>
                      {account.name}
                    </strong>


                    <span>

                      {account.type ===
                        "cash" &&
                        "Physical money"}

                      {account.type ===
                        "bank" &&
                        "Bank account"}

                      {account.type ===
                        "wallet" &&
                        "Digital money"}

                      {account.type ===
                        "savings" &&
                        "Long-term savings"}

                      {account.type ===
                        "other" &&
                        "Other account"}

                    </span>

                  </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="account-actions">

                  <strong>

                    ₹
                    {
                      account.balance
                        .toLocaleString(
                          "en-IN"
                        )
                    }

                  </strong>


                  {/* =================================================
                      EDIT
                  ================================================= */}

                  <button
                    className="account-edit-button"

                    onClick={() =>
                      setAccountToEdit(
                        account
                      )
                    }

                    title="Edit account"

                    aria-label={
                      `Edit ${account.name}`
                    }
                  >

                    <Pencil size={16} />

                  </button>


                  {/* =================================================
                      DELETE
                  ================================================= */}

                  <button
                    className="account-delete-button"

                    onClick={() =>
                      handleDeleteAccount(
                        account
                      )
                    }

                    title="Delete account"

                    aria-label={
                      `Delete ${account.name}`
                    }
                  >

                    <Trash2 size={16} />

                  </button>

                </div>

              </div>

            )
          )

        )}

      </div>


      {/* =================================================
          VIEW ALL ACCOUNTS
      ================================================= */}

      <button
        className="view-all-accounts"

        onClick={() =>
          navigate(
            "/accounts"
          )
        }
      >

        <span>
          View all accounts
        </span>

        <ArrowUpRight
          size={15}
        />

      </button>


      {/* =================================================
          ADD ACCOUNT MODAL
      ================================================= */}

      {showAddAccount && (

        <AddAccountModal

          accounts={
            accounts
          }

          onClose={() =>
            setShowAddAccount(
              false
            )
          }

          onAddAccount={
            handleAddAccount
          }

        />

      )}


      {/* =================================================
          EDIT ACCOUNT MODAL
      ================================================= */}

      {accountToEdit && (

        <EditAccountModal

          account={
            accountToEdit
          }

          accounts={
            accounts
          }

          onClose={() =>
            setAccountToEdit(
              null
            )
          }

          onEditAccount={
            (
              updatedAccount
            ) =>
              handleEditAccount(
                accountToEdit,
                updatedAccount
              )
          }

        />

      )}


      {/* =================================================
          DELETE ACCOUNT CONFIRMATION MODAL
      ================================================= */}

      {accountToDelete && (

        <DeleteAccountModal

          account={
            accountToDelete
          }

          onClose={() =>
            setAccountToDelete(
              null
            )
          }

          onConfirm={
            confirmDeleteAccount
          }

        />

      )}


      {/* =================================================
          ERROR MODAL
      ================================================= */}

      {showErrorModal && (

        <div
          className="spendwise-error-overlay"

          onClick={
            closeErrorModal
          }
        >

          <div
            className="spendwise-error-modal"

            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              className="spendwise-error-close"

              onClick={
                closeErrorModal
              }

              aria-label="Close"
            >

              <X size={18} />

            </button>


            {/* =================================================
                WARNING ICON
            ================================================= */}

            <div className="spendwise-error-icon">

              <AlertTriangle
                size={30}
              />

            </div>


            {/* =================================================
                TITLE
            ================================================= */}

            <h2>
              Can't Delete Account
            </h2>


            {/* =================================================
                MESSAGE
            ================================================= */}

            <p className="spendwise-error-message">

              {errorMessage}

            </p>


            {/* =================================================
                HELP BOX
            ================================================= */}

            <div className="spendwise-error-help">

              <div className="spendwise-error-help-icon">

                <ReceiptText
                  size={18}
                />

              </div>


              <div>

                <strong>
                  What you can do
                </strong>

                <span>
                  Delete or move the linked transaction first, then try deleting this account again.
                </span>

              </div>

            </div>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="spendwise-error-actions">


              {/* CLOSE */}

              <button
                className="spendwise-error-secondary"

                onClick={
                  closeErrorModal
                }
              >

                Close

              </button>


              {/* VIEW TRANSACTIONS */}

              <button
                className="spendwise-error-primary"

                onClick={() => {

                  closeErrorModal();

                  navigate(
                    "/transactions"
                  );

                }}
              >

                View Transactions

                <ArrowUpRight
                  size={16}
                />

              </button>


            </div>

          </div>

        </div>

      )}

    </article>

  );

}


export default AccountsCard;