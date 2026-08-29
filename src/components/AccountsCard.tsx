import {
  Plus,
  ArrowUpRight,
  Trash2,
  Pencil,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddAccountModal from "./AddAccountModal";
import EditAccountModal from "./EditAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";

import "./AccountsCard.css";


interface Account {
  name: string;
  type: string;
  balance: number;
}


interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  accountName: string;
}


interface AccountsCardProps {
  accounts: Account[];

  setAccounts: React.Dispatch<
    React.SetStateAction<Account[]>
  >;

  onAddTransaction: (
    transaction: Transaction
  ) => void;

  onEditAccount: (
    oldAccount: Account,
    updatedAccount: Account
  ) => void;
}


function AccountsCard({

  accounts,

  setAccounts,

  onAddTransaction,

  onEditAccount,

}: AccountsCardProps) {


  const navigate =
    useNavigate();


  // =========================================
  // MODAL STATES
  // =========================================

  const [
    showAddAccount,
    setShowAddAccount,
  ] = useState(false);


  const [
    accountToDelete,
    setAccountToDelete,
  ] = useState<Account | null>(
    null
  );


  const [
    accountToEdit,
    setAccountToEdit,
  ] = useState<Account | null>(
    null
  );


  // =========================================
  // ADD ACCOUNT
  // =========================================

  const handleAddAccount = (
    account: Account
  ) => {


    // =====================================
    // PREVENT DUPLICATE ACCOUNT NAME
    // =====================================

    const duplicateName =
      accounts.some(

        (currentAccount) =>

          currentAccount.name
            .trim()
            .toLowerCase() ===

          account.name
            .trim()
            .toLowerCase()

      );


    if (duplicateName) {

      alert(
        "An account with this name already exists."
      );

      return;

    }


    // =====================================
    // PREVENT DUPLICATE TYPE
    //
    // Multiple BANK accounts are allowed.
    //
    // Only one Cash, Wallet and Savings
    // account is allowed.
    // =====================================

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

        alert(
          "An account with this type already exists."
        );

        return;

      }

    }


    // =====================================
    // ADD ACCOUNT
    // =====================================

    setAccounts(

      (currentAccounts) => [

        ...currentAccounts,

        account,

      ]

    );


    // =====================================
    // CREATE INITIAL BALANCE TRANSACTION
    // =====================================

    if (account.balance > 0) {


      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      const incomeTransaction:
        Transaction = {

          id:
            Date.now(),

          type:
            "income",

          category:
            "other",

          description:
            `Initial balance - ${account.name}`,

          amount:
            account.balance,

          date:
            today,

          accountName:
            account.name,

        };


      onAddTransaction(
        incomeTransaction
      );

    }


    // =====================================
    // CLOSE MODAL
    // =====================================

    setShowAddAccount(
      false
    );

  };


  // =========================================
  // EDIT ACCOUNT
  // =========================================

  const handleEditAccount = (

    oldAccount: Account,

    updatedAccount: Account

  ) => {


    onEditAccount(

      oldAccount,

      updatedAccount

    );


    // Close modal

    setAccountToEdit(
      null
    );

  };


  // =========================================
  // DELETE ACCOUNT
  // =========================================

  const handleDeleteAccount = (
    account: Account
  ) => {

    setAccountToDelete(
      account
    );

  };


  const confirmDeleteAccount =
    () => {


      if (!accountToDelete) {

        return;

      }


      setAccounts(

        (currentAccounts) =>

          currentAccounts.filter(

            (currentAccount) =>

              currentAccount.name !==
              accountToDelete.name

          )

      );


      setAccountToDelete(
        null
      );

    };


  // =========================================
  // RENDER
  // =========================================

  return (

    <article className="accounts-card">


      {/* =====================================
          HEADER
      ====================================== */}

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


      {/* =====================================
          ACCOUNTS LIST
      ====================================== */}

      <div className="accounts-list">


        {accounts.length === 0 ? (

          <div className="accounts-empty">

            <p>
              No accounts yet.
            </p>

          </div>

        ) : (

          accounts.map(

            (account) => (

              <div

                className="account-row"

                key={account.name}

              >


                {/* LEFT SIDE */}

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

                    </span>

                  </div>


                </div>


                {/* RIGHT SIDE */}

                <div className="account-actions">


                  <strong>

                    ₹{
                      account.balance.toLocaleString(
                        "en-IN"
                      )
                    }

                  </strong>


                  {/* EDIT */}

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


                  {/* DELETE */}

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


      {/* =====================================
          VIEW ALL ACCOUNTS
      ====================================== */}

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

        <ArrowUpRight size={15} />

      </button>


      {/* =====================================
            ADD ACCOUNT MODAL
        ===================================== */}

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


      {/* =====================================
          EDIT ACCOUNT MODAL
      ====================================== */}

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
            (updatedAccount) =>

              handleEditAccount(

                accountToEdit,

                updatedAccount

              )
          }

        />

      )}


      {/* =====================================
          DELETE ACCOUNT MODAL
      ====================================== */}

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


    </article>

  );

}


export default AccountsCard;