import { useState } from "react";
import { X } from "lucide-react";

import "./AddAccountModal.css";


interface Account {
  name: string;
  type: string;
  balance: number;
}


interface EditAccountModalProps {
  account: Account;

  accounts: Account[];

  onClose: () => void;

  onEditAccount: (
    oldAccount: Account,
    updatedAccount: Account
  ) => void;
}


function EditAccountModal({

  account,

  accounts,

  onClose,

  onEditAccount,

}: EditAccountModalProps) {


  // =========================================
  // FORM STATES
  // =========================================

  const [
    accountName,
    setAccountName,
  ] = useState(
    account.name
  );


  const [
    accountType,
    setAccountType,
  ] = useState(
    account.type
  );


  const [
    balance,
    setBalance,
  ] = useState(
    account.balance.toString()
  );


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


    // ---------------------------------------
    // VALIDATE ACCOUNT NAME
    // ---------------------------------------

    if (
      !accountName.trim()
    ) {

      setError(
        "Please enter an account name."
      );

      return;

    }


    // ---------------------------------------
    // VALIDATE ACCOUNT TYPE
    // ---------------------------------------

    if (
      !accountType
    ) {

      setError(
        "Please select an account type."
      );

      return;

    }


    // ---------------------------------------
    // VALIDATE BALANCE
    // ---------------------------------------

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


    // ---------------------------------------
    // PREVENT DUPLICATE ACCOUNT NAME
    // ---------------------------------------

    const duplicateName =
      accounts.some(

        (
          currentAccount
        ) =>

          currentAccount.name
            .trim()
            .toLowerCase() ===

            accountName
              .trim()
              .toLowerCase() &&

          currentAccount.name !==
            account.name

      );


    if (
      duplicateName
    ) {

      setError(
        "An account with this name already exists."
      );

      return;

    }


    // ---------------------------------------
    // CREATE UPDATED ACCOUNT
    // ---------------------------------------

    const updatedAccount:
      Account = {

        name:
          accountName.trim(),

        type:
          accountType,

        balance:
          Number(balance),

      };


    // ---------------------------------------
    // SEND OLD + UPDATED ACCOUNT
    // ---------------------------------------

    onEditAccount(

      account,

      updatedAccount

    );


    // ---------------------------------------
    // CLEAR ERROR
    // ---------------------------------------

    setError(
      ""
    );


    // ---------------------------------------
    // CLOSE MODAL
    // ---------------------------------------

    onClose();

  };


  // =========================================
  // RENDER
  // =========================================

  return (

    <div

      className="modal-overlay"

      onClick={onClose}

    >


      <div

        className="add-account-modal"

        onClick={
          (e) =>
            e.stopPropagation()
        }

      >


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="modal-header">


          <div>

            <h2>
              Edit Account
            </h2>


            <p>
              Update your account details.
            </p>

          </div>


          <button

            type="button"

            className="modal-close"

            onClick={onClose}

            aria-label="Close"

          >

            <X size={18} />

          </button>


        </div>


        {/* =====================================
            FORM
        ====================================== */}

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

                  setError(
                    ""
                  );

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

                  setError(
                    ""
                  );

                }
              }

            >


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

                    setError(
                      ""
                    );

                  }
                }

              />


            </div>


          </div>


          {/* ERROR MESSAGE */}

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

              onClick={onClose}

            >

              Cancel

            </button>


            <button

              type="submit"

              className="add-account-button"

            >

              Save Changes

            </button>


          </div>


        </form>


      </div>


    </div>

  );

}


export default EditAccountModal;