import {
  Plus,
  Pencil,
  Trash2,
  WalletCards,
  Building2,
  CreditCard,
  Target,
  AlertTriangle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import AddAccountModal from "../components/AddAccountModal";
import Sidebar from "../components/Sidebar";

import "./Accounts.css";


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
// COMPONENT
// =====================================================

function Accounts() {


  // =====================================================
  // ACCOUNTS STATE
  // =====================================================

  const [
    accounts,
    setAccounts,
  ] = useState<Account[]>([]);


  // =====================================================
  // LOADING STATE
  // =====================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  // =====================================================
  // ERROR STATE
  // =====================================================

  const [
    error,
    setError,
  ] = useState("");


  // =====================================================
  // ADD ACCOUNT MODAL
  // =====================================================

  const [
    showAddAccount,
    setShowAddAccount,
  ] = useState(false);


  // =====================================================
  // EDIT ACCOUNT MODAL
  // =====================================================

  const [
    editingAccount,
    setEditingAccount,
  ] = useState<Account | null>(null);


  // =====================================================
  // DELETE ACCOUNT MODAL
  // =====================================================

  const [
    deleteAccount,
    setDeleteAccount,
  ] = useState<Account | null>(null);


  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getToken = () => {

    return (

      localStorage.getItem("token")

      ||

      sessionStorage.getItem("token")

    );

  };


  // =====================================================
  // CONVERT FRONTEND TYPE TO BACKEND TYPE
  //
  // Frontend:
  // cash
  //
  // Backend:
  // Cash
  // =====================================================

  const convertToBackendType = (
    type: string
  ) => {

    const normalizedType =
      type.toLowerCase();


    if (
      normalizedType === "cash"
    ) {

      return "Cash";

    }


    if (
      normalizedType === "bank"
    ) {

      return "Bank";

    }


    if (
      normalizedType === "wallet"
    ) {

      return "Wallet";

    }


    if (
      normalizedType === "savings"
    ) {

      return "Savings";

    }


    return "Other";

  };


  // =====================================================
  // FETCH ACCOUNTS
  // =====================================================

  const fetchAccounts = async () => {

    try {

      setLoading(true);

      setError("");


      const token =
        getToken();


      if (!token) {

        setError(
          "You are not logged in."
        );

        return;

      }


      const response =
        await fetch(

          "http://localhost:5000/api/accounts",

          {

            method: "GET",

            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",

            },

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        setError(

          data.message

          ||

          "Failed to fetch accounts."

        );

        return;

      }


      // ===============================================
      // FORMAT BACKEND TYPES
      //
      // Backend:
      // Cash, Bank, Wallet
      //
      // Frontend:
      // cash, bank, wallet
      // ===============================================

      const formattedAccounts =
        data.accounts.map(
          (account: Account) => ({

            ...account,

            type:
              account.type.toLowerCase(),

          })
        );


      setAccounts(
        formattedAccounts
      );


    } catch (error) {

      console.error(
        "Fetch accounts error:",
        error
      );


      setError(
        "Unable to connect to the server."
      );


    } finally {

      setLoading(
        false
      );

    }

  };


  // =====================================================
  // FETCH ON PAGE LOAD
  // =====================================================

  useEffect(() => {

    fetchAccounts();

  }, []);


  // =====================================================
  // TOTAL BALANCE
  // =====================================================

  const totalBalance =
    accounts.reduce(

      (
        total,
        account
      ) =>

        total +
        account.balance,

      0

    );


  // =====================================================
  // ADD ACCOUNT
  // =====================================================

  const handleAddAccount =
    async (
      account: Account
    ) => {

      try {

        setError("");


        const token =
          getToken();


        if (!token) {

          setError(
            "You are not logged in."
          );

          return;

        }


        const backendType =
          convertToBackendType(
            account.type
          );


        // ===============================================
        // CREATE ACCOUNT
        // ===============================================

        const response =
          await fetch(

            "http://localhost:5000/api/accounts",

            {

              method:
                "POST",


              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },


              body:
                JSON.stringify({

                  name:
                    account.name,

                  type:
                    backendType,

                  balance:
                    Number(
                      account.balance
                    ),

                }),

            }

          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(

            data.message

            ||

            "Failed to create account."

          );

          return;

        }


        // ===============================================
        // FORMAT RESPONSE
        // ===============================================

        const newAccount: Account = {

          ...data.account,

          type:
            data.account.type.toLowerCase(),

        };


        // ===============================================
        // UPDATE STATE
        // ===============================================

        setAccounts(

          (
            currentAccounts
          ) => [

            ...currentAccounts,

            newAccount,

          ]

        );


        // ===============================================
        // CLOSE MODAL
        // ===============================================

        setShowAddAccount(
          false
        );


      } catch (error) {

        console.error(
          "Add account error:",
          error
        );


        setError(
          "Unable to connect to the server."
        );

      }

    };


  // =====================================================
  // OPEN DELETE MODAL
  // =====================================================

  const handleDeleteAccount = (
    account: Account
  ) => {

    setDeleteAccount(
      account
    );

  };


  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDeleteAccount =
    async () => {

      if (!deleteAccount) {

        return;

      }


      try {

        setError("");


        const token =
          getToken();


        if (!token) {

          setError(
            "You are not logged in."
          );

          return;

        }


        if (!deleteAccount._id) {

          setError(
            "Account ID is missing."
          );

          return;

        }


        // ===============================================
        // DELETE ACCOUNT
        // ===============================================

        const response =
          await fetch(

            `http://localhost:5000/api/accounts/${deleteAccount._id}`,

            {

              method:
                "DELETE",


              headers: {

                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",

              },

            }

          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(

            data.message

            ||

            "Failed to delete account."

          );

          return;

        }


        // ===============================================
        // UPDATE STATE
        // ===============================================

        setAccounts(

          (
            currentAccounts
          ) =>

            currentAccounts.filter(

              (
                account
              ) =>

                account._id !==
                deleteAccount._id

            )

        );


        setDeleteAccount(
          null
        );


      } catch (error) {

        console.error(
          "Delete account error:",
          error
        );


        setError(
          "Unable to connect to the server."
        );

      }

    };


  // =====================================================
  // EDIT ACCOUNT
  // =====================================================

  const handleEditAccount =
    async () => {

      if (!editingAccount) {

        return;

      }


      try {

        setError("");


        const token =
          getToken();


        if (!token) {

          setError(
            "You are not logged in."
          );

          return;

        }


        if (!editingAccount._id) {

          setError(
            "Account ID is missing."
          );

          return;

        }


        const backendType =
          convertToBackendType(
            editingAccount.type
          );


        // ===============================================
        // UPDATE ACCOUNT
        // ===============================================

        const response =
          await fetch(

            `http://localhost:5000/api/accounts/${editingAccount._id}`,

            {

              method:
                "PUT",


              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },


              body:
                JSON.stringify({

                  name:
                    editingAccount.name,

                  type:
                    backendType,

                  balance:
                    Number(
                      editingAccount.balance
                    ),

                }),

            }

          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(

            data.message

            ||

            "Failed to update account."

          );

          return;

        }


        // ===============================================
        // FORMAT RESPONSE
        // ===============================================

        const updatedAccount: Account = {

          ...data.account,

          type:
            data.account.type.toLowerCase(),

        };


        // ===============================================
        // UPDATE STATE
        // ===============================================

        setAccounts(

          (
            currentAccounts
          ) =>

            currentAccounts.map(

              (
                account
              ) =>

                account._id ===
                updatedAccount._id

                  ? updatedAccount

                  : account

            )

        );


        setEditingAccount(
          null
        );


      } catch (error) {

        console.error(
          "Edit account error:",
          error
        );


        setError(
          "Unable to connect to the server."
        );

      }

    };


  // =====================================================
  // ACCOUNT ICON
  // =====================================================

  const getAccountIcon = (
    type: string
  ) => {

    if (
      type === "cash"
    ) {

      return (
        <WalletCards
          size={22}
        />
      );

    }


    if (
      type === "bank"
    ) {

      return (
        <Building2
          size={22}
        />
      );

    }


    if (
      type === "wallet"
    ) {

      return (
        <CreditCard
          size={22}
        />
      );

    }


    if (
      type === "savings"
    ) {

      return (
        <Target
          size={22}
        />
      );

    }


    return (
      <WalletCards
        size={22}
      />
    );

  };


  // =====================================================
  // ACCOUNT DESCRIPTION
  // =====================================================

  const getAccountDescription = (
    type: string
  ) => {

    if (
      type === "cash"
    ) {

      return "Physical money";

    }


    if (
      type === "bank"
    ) {

      return "Bank account";

    }


    if (
      type === "wallet"
    ) {

      return "Digital money";

    }


    if (
      type === "savings"
    ) {

      return "Long-term savings";

    }


    return "Financial account";

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <main
      className="accounts-page"
    >

      <Sidebar />


      <section
        className="accounts-main"
      >


        {/* =============================================
            HEADER
        ============================================== */}

        <div
          className="accounts-page-header"
        >

          <div>

            <h1>
              Accounts
            </h1>


            <p>
              Manage all your accounts
              and balances
            </p>

          </div>


          <button

            className="accounts-page-add"

            onClick={() =>
              setShowAddAccount(
                true
              )
            }

          >

            <Plus
              size={18}
            />

            Add Account

          </button>

        </div>


        {/* =============================================
            ERROR
        ============================================== */}

        {error && (

          <div
            style={{

              color:
                "#dc2626",

              backgroundColor:
                "#fef2f2",

              border:
                "1px solid #fecaca",

              padding:
                "12px",

              borderRadius:
                "8px",

              marginBottom:
                "20px",

            }}
          >

            {error}

          </div>

        )}


        {/* =============================================
            SUMMARY
        ============================================== */}

        <section
          className="accounts-summary"
        >

          <div
            className="accounts-summary-card"
          >

            <span>
              Total Balance
            </span>


            <strong>

              ₹

              {totalBalance.toLocaleString(
                "en-IN"
              )}

            </strong>


            <small>
              Across all accounts
            </small>

          </div>


          <div
            className="accounts-summary-card"
          >

            <span>
              Total Accounts
            </span>


            <strong>

              {accounts.length}

            </strong>


            <small>
              Active accounts
            </small>

          </div>


          <div
            className="accounts-summary-card"
          >

            <span>
              Largest Account
            </span>


            <strong>

              ₹

              {(
                accounts.length > 0

                  ? Math.max(
                      ...accounts.map(
                        (account) =>
                          account.balance
                      )
                    )

                  : 0

              ).toLocaleString(
                "en-IN"
              )}

            </strong>


            <small>
              Highest balance
            </small>

          </div>

        </section>


        {/* =============================================
            ACCOUNTS LIST
        ============================================== */}

        <section
          className="accounts-page-list"
        >

          <div
            className="accounts-page-list-header"
          >

            <div>

              <h2>
                Your Accounts
              </h2>


              <p>
                All your money
                in one place
              </p>

            </div>

          </div>


          {loading ? (

            <p>
              Loading your accounts...
            </p>

          ) : (

            <div
              className="accounts-page-grid"
            >

              {accounts.map(

                (
                  account
                ) => (

                  <article

                    className="account-detail-card"

                    key={
                      account._id ||
                      account.name
                    }

                  >

                    <div
                      className="account-detail-top"
                    >

                      <div

                        className={
                          `account-detail-icon ${account.type}`
                        }

                      >

                        {getAccountIcon(
                          account.type
                        )}

                      </div>


                      <div
                        className="account-detail-actions"
                      >

                        <button

                          className="account-edit-button"

                          onClick={() =>
                            setEditingAccount({

                              ...account,

                            })
                          }

                          title="Edit account"

                        >

                          <Pencil
                            size={16}
                          />

                        </button>


                        <button

                          className="account-delete-button"

                          onClick={() =>
                            handleDeleteAccount(
                              account
                            )
                          }

                          title="Delete account"

                        >

                          <Trash2
                            size={16}
                          />

                        </button>

                      </div>

                    </div>


                    <div
                      className="account-detail-info"
                    >

                      <h3>

                        {account.name}

                      </h3>


                      <span>

                        {getAccountDescription(
                          account.type
                        )}

                      </span>

                    </div>


                    <div
                      className="account-detail-balance"
                    >

                      <span>
                        Current Balance
                      </span>


                      <strong>

                        ₹

                        {account.balance.toLocaleString(
                          "en-IN"
                        )}

                      </strong>

                    </div>

                  </article>

                )

              )}


              <button

                className="account-add-card"

                onClick={() =>
                  setShowAddAccount(
                    true
                  )
                }

              >

                <div
                  className="account-add-icon"
                >

                  <Plus
                    size={24}
                  />

                </div>


                <strong>
                  Add New Account
                </strong>


                <span>
                  Track another source
                  of money
                </span>

              </button>

            </div>

          )}

        </section>


        {/* =============================================
            ADD ACCOUNT MODAL
        ============================================== */}

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


        {/* =============================================
            EDIT ACCOUNT MODAL
        ============================================== */}

        {editingAccount && (

          <div
            className="edit-account-overlay"
          >

            <div
              className="edit-account-modal"
            >

              <div
                className="edit-account-header"
              >

                <div>

                  <h2>
                    Edit Account
                  </h2>


                  <p>
                    Update your account
                    details
                  </p>

                </div>


                <button

                  onClick={() =>
                    setEditingAccount(
                      null
                    )
                  }

                >

                  ×

                </button>

              </div>


              <label>
                Account name
              </label>


              <input

                value={
                  editingAccount.name
                }

                onChange={
                  (event) =>

                    setEditingAccount({

                      ...editingAccount,

                      name:
                        event.target.value,

                    })

                }

              />


              <label>
                Account type
              </label>


              <select

                value={
                  editingAccount.type
                }

                onChange={
                  (event) =>

                    setEditingAccount({

                      ...editingAccount,

                      type:
                        event.target.value,

                    })

                }

              >

                <option value="cash">
                  Cash
                </option>


                <option value="bank">
                  Bank Account
                </option>


                <option value="wallet">
                  Wallet
                </option>


                <option value="savings">
                  Savings
                </option>


                <option value="other">
                  Other
                </option>

              </select>


              <label>
                Current balance
              </label>


              <input

                type="number"

                min="0"

                value={
                  editingAccount.balance
                }

                onChange={
                  (event) =>

                    setEditingAccount({

                      ...editingAccount,

                      balance:
                        Number(
                          event.target.value
                        ),

                    })

                }

              />


              <div
                className="edit-account-buttons"
              >

                <button

                  onClick={() =>
                    setEditingAccount(
                      null
                    )
                  }

                >

                  Cancel

                </button>


                <button

                  onClick={
                    handleEditAccount
                  }

                >

                  Save Changes

                </button>

              </div>

            </div>

          </div>

        )}


        {/* =============================================
            DELETE ACCOUNT MODAL
        ============================================== */}

        {deleteAccount && (

          <div

            className="delete-account-overlay"

            onClick={() =>
              setDeleteAccount(
                null
              )
            }

          >

            <div

              className="delete-account-modal"

              onClick={
                (event) =>
                  event.stopPropagation()
              }

            >

              <div
                className="delete-warning-icon"
              >

                <AlertTriangle
                  size={30}
                />

              </div>


              <h2>
                Delete Account?
              </h2>


              <p>

                Are you sure you want
                to delete

                <strong>

                  {" "}
                  "{deleteAccount.name}"

                </strong>

                ?

              </p>


              <span
                className="delete-warning-text"
              >

                This action cannot
                be undone.

              </span>


              <div
                className="delete-account-actions"
              >

                <button

                  className="delete-cancel-button"

                  onClick={() =>
                    setDeleteAccount(
                      null
                    )
                  }

                >

                  Cancel

                </button>


                <button

                  className="delete-confirm-button"

                  onClick={
                    confirmDeleteAccount
                  }

                >

                  <Trash2
                    size={17}
                  />

                  Delete Account

                </button>

              </div>

            </div>

          </div>

        )}


      </section>

    </main>

  );

}


export default Accounts;