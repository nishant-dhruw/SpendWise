import { X } from "lucide-react";
import { useState } from "react";

import "./AddTransactionModal.css";
import AlertModal from "./AlertModal";


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


interface Account {

  _id?: string;

  name: string;

  type: string;

  balance: number;

}


interface AddTransactionModalProps {

  onClose: () => void;

  onAddTransaction: (
    transaction: Transaction
  ) => Promise<void> | void;

  onEditTransaction?: (
    oldTransaction: Transaction,
    updatedTransaction: Transaction
  ) => Promise<void> | void;

  transactionToEdit?: Transaction | null;

  accounts: Account[];

}


// =========================================================
// GET TODAY'S DATE
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


  // =======================================================
  // FORM STATE
  // =======================================================

  const [type, setType] =
    useState<
      "income"
      | "expense"
    >(


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


  // =======================================================
  // ALERT STATE
  // =======================================================

  const [showAlert, setShowAlert] =
    useState(false);


  const [alertTitle, setAlertTitle] =
    useState("");


  const [alertMessage, setAlertMessage] =
    useState("");


  // =======================================================
  // SHOW ERROR
  // =======================================================

  const showError = (

    title: string,

    message: string

  ) => {

    setAlertTitle(
      title
    );


    setAlertMessage(
      message
    );


    setShowAlert(
      true
    );

  };


  // =======================================================
  // TYPE CHANGE
  // =======================================================

  const handleTypeChange = (

    newType:

      | "income"
      | "expense"

  ) => {

    setType(
      newType
    );


    setCategory(
      ""
    );

  };


  // =======================================================
  // GET AVAILABLE BALANCE
  // =======================================================

  const getAvailableBalance = () => {

    const selectedAccount =

      accounts.find(

        (account) =>

          account.name ===
          accountName

      );


    if (
      !selectedAccount
    ) {

      return 0;

    }


    let availableBalance =
      selectedAccount.balance;


    // =====================================================
    // EDITING LOGIC
    // =====================================================

    if (
      transactionToEdit
    ) {


      if (

        transactionToEdit.type ===
        "expense"

        &&

        transactionToEdit.accountName ===
        accountName

      ) {

        availableBalance +=
          transactionToEdit.amount;

      }


      if (

        transactionToEdit.type ===
        "income"

        &&

        transactionToEdit.accountName ===
        accountName

      ) {

        availableBalance -=
          transactionToEdit.amount;

      }

    }


    return availableBalance;

  };


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (

    e: React.FormEvent

  ) => {

    e.preventDefault();


    console.log(
      "ADD TRANSACTION BUTTON CLICKED"
    );


    // =====================================================
    // DESCRIPTION VALIDATION
    // =====================================================

    if (
      !description.trim()
    ) {

      showError(

        "Description Required",

        "Please enter a description for this transaction."

      );

      return;

    }


    // =====================================================
    // AMOUNT VALIDATION
    // =====================================================

    if (

      !amount

      ||

      !Number.isFinite(
        Number(amount)
      )

      ||

      Number(amount) <= 0

    ) {

      showError(

        "Invalid Amount",

        "Please enter a valid amount greater than ₹0."

      );

      return;

    }


    // =====================================================
    // DATE VALIDATION
    // =====================================================

    if (
      !date
    ) {

      showError(

        "Date Required",

        "Please select a transaction date."

      );

      return;

    }


    // =====================================================
    // ACCOUNT VALIDATION
    // =====================================================

    if (
      !accountName
    ) {

      showError(

        "Account Required",

        "Please select an account."

      );

      return;

    }


    // =====================================================
    // CATEGORY VALIDATION
    // =====================================================

    if (
      !category
    ) {

      showError(

        "Category Required",

        "Please select a category."

      );

      return;

    }


    // =====================================================
    // EXPENSE BALANCE VALIDATION
    // =====================================================

    if (
      type === "expense"
    ) {

      const availableBalance =
        getAvailableBalance();


      if (
        Number(amount) >
        availableBalance
      ) {

        showError(

          "Insufficient Balance",

          `Available balance: ₹${availableBalance.toLocaleString(
            "en-IN"
          )}.`

        );

        return;

      }

    }


    // =====================================================
    // CREATE TRANSACTION OBJECT
    // =====================================================

    const updatedTransaction:
      Transaction = {

        id:

          transactionToEdit?.id ||

          "",


        type,


        category,


        description:

          description.trim(),


        amount:

          Number(amount),


        date,


        accountName,

      };


    try {


      // ===================================================
      // EDIT TRANSACTION
      // ===================================================

      if (

        transactionToEdit

        &&

        onEditTransaction

      ) {

        await onEditTransaction(

          transactionToEdit,

          updatedTransaction

        );

      }


      // ===================================================
      // ADD TRANSACTION
      // ===================================================

      else {

        await onAddTransaction(
          updatedTransaction
        );

      }


      // ===================================================
      // CLOSE MODAL ONLY AFTER SUCCESS
      // ===================================================

      onClose();


    } catch (error) {


      console.error(
        "Transaction submit error:",
        error
      );


      showError(

        "Transaction Error",

        error instanceof Error

          ? error.message

          : "Unable to save transaction."

      );

    }

  };


  // =======================================================
  // RENDER
  // =======================================================

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


        {/* HEADER */}

        <div className="transaction-modal-header">


          <div>


            <h2>

              {

                transactionToEdit

                  ? "Edit Transaction"

                  : "Add Transaction"

              }

            </h2>


            <p>

              Record your income
              or expense.

            </p>


          </div>


          <button

            type="button"

            className="transaction-modal-close"

            onClick={onClose}

            aria-label="Close"

          >

            <X size={18} />

          </button>


        </div>


        {/* FORM */}

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

                handleTypeChange(

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


              {type === "expense" && (

                <>


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


                  <option value="other">
                    Other
                  </option>


                </>

              )}


              {type === "income" && (

                <>


                  <option value="salary">
                    Salary
                  </option>


                  <option value="freelance">
                    Freelance
                  </option>


                  <option value="other">
                    Other Income
                  </option>


                </>

              )}


            </select>


          </div>


          {/* DESCRIPTION */}

          <div className="transaction-form-group">


            <label>
              Description
            </label>


            <input

              type="text"

              placeholder={

                type === "income"

                  ? "e.g. Salary for August"

                  : "e.g. Lunch at restaurant"

              }

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
                      account._id ||
                      account.name
                    }

                    value={account.name}

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

              {

                transactionToEdit

                  ? "Save Changes"

                  : "Add Transaction"

              }

            </button>


          </div>


        </form>


      </div>


      {/* ALERT */}

      {showAlert && (

        <AlertModal

          title={alertTitle}

          message={alertMessage}

          onClose={() => {

            setShowAlert(
              false
            );


            setAlertTitle(
              ""
            );


            setAlertMessage(
              ""
            );

          }}

        />

      )}


    </div>

  );

}


export default AddTransactionModal;