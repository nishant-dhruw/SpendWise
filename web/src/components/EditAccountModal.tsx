import {
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import "./AddAccountModal.css";


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
// PROPS
// =====================================================

interface EditAccountModalProps {

  account:
    Account;


  accounts:
    Account[];


  onClose:
    () => void;


  // ===============================================
  // SEND ONLY UPDATED ACCOUNT
  //
  // AccountsCard already knows the old account
  // ===============================================

  onEditAccount:

    (
      updatedAccount: Account
    ) => Promise<void>;

}


// =====================================================
// COMPONENT
// =====================================================

function EditAccountModal({

  account,

  accounts,

  onClose,

  onEditAccount,

}: EditAccountModalProps) {


  // =====================================================
  // FORM STATES
  // =====================================================

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

  ] = useState(
    ""
  );


  const [

    isSaving,

    setIsSaving,

  ] = useState(
    false
  );


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =

    async (

      e: React.FormEvent

    ) => {


      e.preventDefault();


      // =================================================
      // VALIDATE ACCOUNT NAME
      // =================================================

      if (

        !accountName.trim()

      ) {

        setError(

          "Please enter an account name."

        );

        return;

      }


      // =================================================
      // VALIDATE ACCOUNT TYPE
      // =================================================

      if (

        !accountType

      ) {

        setError(

          "Please select an account type."

        );

        return;

      }


      // =================================================
      // VALIDATE BALANCE
      // =================================================

      if (

        balance === ""

        ||

        Number(balance) < 0

        ||

        isNaN(

          Number(balance)

        )

      ) {

        setError(

          "Please enter a valid balance."

        );

        return;

      }


      // =================================================
      // PREVENT DUPLICATE ACCOUNT NAME
      // =================================================

      const duplicateName =

        accounts.some(

          (

            currentAccount

          ) =>

            currentAccount.name
              .trim()
              .toLowerCase()

            ===

            accountName
              .trim()
              .toLowerCase()

            &&

            currentAccount._id !==
            account._id

        );


      if (

        duplicateName

      ) {

        setError(

          "An account with this name already exists."

        );

        return;

      }


      // =================================================
      // CREATE UPDATED ACCOUNT
      // =================================================

      const updatedAccount:

        Account = {

          // Keep account ID

          _id:
            account._id,


          name:

            accountName
              .trim(),


          type:
            accountType,


          balance:

            Number(
              balance
            ),

        };


      try {


        // ===============================================
        // START SAVING
        // ===============================================

        setIsSaving(
          true
        );


        setError(
          ""
        );


        // ===============================================
        // SEND UPDATED ACCOUNT ONLY
        // ===============================================

        await onEditAccount(

          updatedAccount

        );


        // ===============================================
        // CLOSE MODAL ONLY AFTER SUCCESS
        // ===============================================

        onClose();


      } catch (error) {


        console.error(

          "Error editing account:",

          error

        );


        setError(

          error instanceof Error

            ? error.message

            : "Failed to update account."

        );


      } finally {


        setIsSaving(
          false
        );

      }

    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div

      className="modal-overlay"

      onClick={

        isSaving

          ? undefined

          : onClose

      }

    >


      <div

        className="add-account-modal"

        onClick={

          (
            e
          ) =>

            e.stopPropagation()

        }

      >


        {/* =============================================
            HEADER
        ============================================= */}

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

            onClick={
              onClose
            }

            disabled={
              isSaving
            }

            aria-label="Close"

          >


            <X
              size={18}
            />


          </button>


        </div>


        {/* =============================================
            FORM
        ============================================= */}

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

              disabled={
                isSaving
              }

              onChange={

                (
                  e
                ) => {


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

              disabled={
                isSaving
              }

              onChange={

                (
                  e
                ) => {


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


              <option value="other">

                Other

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

                disabled={
                  isSaving
                }

                onChange={

                  (
                    e
                  ) => {


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

              disabled={
                isSaving
              }

            >

              Cancel

            </button>


            <button

              type="submit"

              className="add-account-button"

              disabled={
                isSaving
              }

            >

              {

                isSaving

                  ? "Saving..."

                  : "Save Changes"

              }

            </button>


          </div>


        </form>


      </div>


    </div>

  );

}


export default EditAccountModal;