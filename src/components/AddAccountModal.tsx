import { useState } from "react";

import {
  X,
} from "lucide-react";

import "./AddAccountModal.css";


interface Account {
  name: string;
  type: string;
  balance: number;
}


interface AddAccountModalProps {

  accounts: Account[];

  onClose: () => void;

  onAddAccount: (
    account: Account
  ) => void;

}


function AddAccountModal({

  accounts,

  onClose,

  onAddAccount,

}: AddAccountModalProps) {


  const [
    accountName,
    setAccountName,
  ] = useState("");


  const [
    accountType,
    setAccountType,
  ] = useState("");


  const [
    balance,
    setBalance,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    // -----------------------------------------
    // ACCOUNT NAME
    // -----------------------------------------

    if (
      !accountName.trim()
    ) {

      setError(
        "Please enter an account name."
      );

      return;

    }


    // -----------------------------------------
    // PREVENT DUPLICATE ACCOUNT NAME
    // -----------------------------------------

    const duplicateName =
      accounts.some(

        (account) =>

          account.name
            .trim()
            .toLowerCase() ===

          accountName
            .trim()
            .toLowerCase()

      );


    if (
      duplicateName
    ) {

      setError(
        "An account with this name already exists."
      );

      return;

    }


    // -----------------------------------------
    // ACCOUNT TYPE
    // -----------------------------------------

    if (
      !accountType
    ) {

      setError(
        "Please select an account type."
      );

      return;

    }


    // -----------------------------------------
    // PREVENT DUPLICATE TYPE
    //
    // Multiple BANK accounts are allowed.
    //
    // Only one Cash, Wallet and Savings
    // account is allowed.
    // -----------------------------------------

    if (
      accountType !== "bank"
    ) {


      const duplicateType =
        accounts.some(

          (account) =>
            account.type ===
            accountType

        );


      if (
        duplicateType
      ) {

        setError(

          `You already have a ${accountType} account. Only one account of this type is allowed.`

        );

        return;

      }

    }


    // -----------------------------------------
    // BALANCE
    // -----------------------------------------

    if (

      balance === "" ||

      Number(balance) < 0 ||

      isNaN(
        Number(balance)
      )

    ) {

      setError(
        "Please enter a valid balance."
      );

      return;

    }


    // -----------------------------------------
    // CREATE ACCOUNT
    // -----------------------------------------

    const newAccount: Account = {

      name:
        accountName.trim(),

      type:
        accountType,

      balance:
        Number(balance),

    };


    onAddAccount(
      newAccount
    );


    setError("");


    // Parent component closes modal

  };


  // =========================================
  // RENDER
  // =========================================

  return (

    <div

      className="modal-overlay"

      onClick={
        onClose
      }

    >


      <div

        className="add-account-modal"

        onClick={
          (e) =>
            e.stopPropagation()
        }

      >


        {/* HEADER */}

        <div className="modal-header">


          <div>

            <h2>
              Add Account
            </h2>


            <p>
              Add a new account to track your money.
            </p>

          </div>


          <button

            type="button"

            className="modal-close"

            onClick={
              onClose
            }

            aria-label="Close"

          >

            <X size={18} />

          </button>


        </div>


        {/* FORM */}

        <form

          className="account-form"

          onSubmit={
            handleSubmit
          }

        >


          {/* ACCOUNT NAME */}

          <div className="form-group">


            <label>
              Account name
            </label>


            <input

              type="text"

              placeholder="e.g. HDFC Bank"

              value={
                accountName
              }

              onChange={
                (e) => {

                  setAccountName(
                    e.target.value
                  );

                  setError("");

                }
              }

            />


          </div>


          {/* ACCOUNT TYPE */}

          <div className="form-group">


            <label>
              Account type
            </label>


            <select

              value={
                accountType
              }

              onChange={
                (e) => {

                  setAccountType(
                    e.target.value
                  );

                  setError("");

                }
              }

            >


              <option

                value=""

                disabled

              >

                Select account type

              </option>


              {/* CASH - ONLY ONE */}

              <option

                value="cash"

                disabled={
                  accounts.some(
                    (account) =>
                      account.type ===
                      "cash"
                  )
                }

              >

                Cash

              </option>


              {/* BANK - MULTIPLE ALLOWED */}

              <option

                value="bank"

              >

                Bank Account

              </option>


              {/* WALLET - ONLY ONE */}

              <option

                value="wallet"

                disabled={
                  accounts.some(
                    (account) =>
                      account.type ===
                      "wallet"
                  )
                }

              >

                Online Wallet

              </option>


              {/* SAVINGS - ONLY ONE */}

              <option

                value="savings"

                disabled={
                  accounts.some(
                    (account) =>
                      account.type ===
                      "savings"
                  )
                }

              >

                Savings Account

              </option>


            </select>


          </div>


          {/* BALANCE */}

          <div className="form-group">


            <label>
              Current balance
            </label>


            <div className="amount-input">


              <span>
                ₹
              </span>


              <input

                type="number"

                placeholder="0"

                min="0"

                value={
                  balance
                }

                onChange={
                  (e) => {

                    setBalance(
                      e.target.value
                    );

                    setError("");

                  }
                }

              />


            </div>


          </div>


          {/* ERROR */}

          {error && (

            <p className="form-error">

              {error}

            </p>

          )}


          {/* BUTTONS */}

          <div className="modal-actions">


            <button

              type="button"

              className="cancel-button"

              onClick={
                onClose
              }

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