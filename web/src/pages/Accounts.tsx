import {
  Plus,
  Pencil,
  Trash2,
  WalletCards,
  Building2,
  CreditCard,
  Target,
} from "lucide-react";

import { useEffect, useState } from "react";
import AddAccountModal from "../components/AddAccountModal";
import Sidebar from "../components/Sidebar";

import "./Accounts.css";

interface Account {
  name: string;
  type: string;
  balance: number;
}

function Accounts() {

  // ================= ACCOUNTS =================

  const [accounts, setAccounts] = useState<Account[]>(() => {

    const savedAccounts = localStorage.getItem(
      "spendwise_accounts"
    );

    if (savedAccounts) {
      return JSON.parse(savedAccounts);
    }

    return [
      {
        name: "Cash",
        type: "cash",
        balance: 5000,
      },
      {
        name: "Bank Account",
        type: "bank",
        balance: 35420,
      },
      {
        name: "Online Wallet",
        type: "wallet",
        balance: 12000,
      },
      {
        name: "Savings Account",
        type: "savings",
        balance: 23000,
      },
    ];

  });


  const [showAddAccount, setShowAddAccount] =
    useState(false);

  const [editingAccount, setEditingAccount] =
    useState<Account | null>(null);


  // ================= SAVE =================

  useEffect(() => {

    localStorage.setItem(
      "spendwise_accounts",
      JSON.stringify(accounts)
    );

    // Tell other components that accounts changed
    window.dispatchEvent(
      new Event("spendwise_accounts_updated")
    );

  }, [accounts]);


  // ================= TOTAL BALANCE =================

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + account.balance,
    0
  );


  // ================= ADD =================

  const handleAddAccount = (account: Account) => {

    setAccounts((currentAccounts) => [
      ...currentAccounts,
      account,
    ]);

    setShowAddAccount(false);

  };


  // ================= DELETE =================

  const handleDeleteAccount = (account: Account) => {

    const transactions =
      JSON.parse(
        localStorage.getItem(
          "spendwise_transactions"
        ) || "[]"
      );

    const hasTransactions =
      transactions.some(
        (transaction: any) =>
          transaction.accountName === account.name
      );

    if (hasTransactions) {

      alert(
        `Cannot delete "${account.name}" because it has transactions linked to it.`
      );

      return;
    }


    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.name}"?`
    );

    if (!confirmed) return;


    setAccounts((currentAccounts) =>
      currentAccounts.filter(
        (currentAccount) =>
          currentAccount.name !== account.name
      )
    );

  };


  // ================= EDIT =================

  const handleEditAccount = () => {

    if (!editingAccount) return;

    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        account.name === editingAccount.name
          ? editingAccount
          : account
      )
    );

    setEditingAccount(null);

  };


  // ================= ICON =================

  const getAccountIcon = (type: string) => {

    if (type === "cash") {
      return <WalletCards size={22} />;
    }

    if (type === "bank") {
      return <Building2 size={22} />;
    }

    if (type === "wallet") {
      return <CreditCard size={22} />;
    }

    if (type === "savings") {
      return <Target size={22} />;
    }

    return <WalletCards size={22} />;
  };


  return (

    <main className="accounts-page">

      <Sidebar />

      <section className="accounts-main">

      {/* ================= HEADER ================= */}

      <div className="accounts-page-header">

        <div>

          <h1>Accounts</h1>

          <p>
            Manage all your accounts and balances
          </p>

        </div>


        <button
          className="accounts-page-add"
          onClick={() =>
            setShowAddAccount(true)
          }
        >

          <Plus size={18} />

          Add Account

        </button>

      </div>


      {/* ================= SUMMARY ================= */}

      <section className="accounts-summary">

        <div className="accounts-summary-card">

          <span>Total Balance</span>

          <strong>
            ₹{totalBalance.toLocaleString("en-IN")}
          </strong>

          <small>
            Across all accounts
          </small>

        </div>


        <div className="accounts-summary-card">

          <span>Total Accounts</span>

          <strong>
            {accounts.length}
          </strong>

          <small>
            Active accounts
          </small>

        </div>


        <div className="accounts-summary-card">

          <span>Largest Account</span>

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
            ).toLocaleString("en-IN")}

          </strong>

          <small>
            Highest balance
          </small>

        </div>

      </section>


      {/* ================= ACCOUNT LIST ================= */}

      <section className="accounts-page-list">

        <div className="accounts-page-list-header">

          <div>

            <h2>Your Accounts</h2>

            <p>
              All your money in one place
            </p>

          </div>

        </div>


        <div className="accounts-page-grid">

          {accounts.map((account) => (

            <article
              className="account-detail-card"
              key={account.name}
            >

              {/* TOP */}

              <div className="account-detail-top">

                <div
                  className={`account-detail-icon ${account.type}`}
                >

                  {getAccountIcon(
                    account.type
                  )}

                </div>


                <div className="account-detail-actions">

                  <button
                    className="account-edit-button"
                    onClick={() =>
                      setEditingAccount({
                        ...account,
                      })
                    }
                  >

                    <Pencil size={16} />

                  </button>


                  <button
                    className="account-delete-button"
                    onClick={() =>
                      handleDeleteAccount(
                        account
                      )
                    }
                  >

                    <Trash2 size={16} />

                  </button>

                </div>

              </div>


              {/* INFO */}

              <div className="account-detail-info">

                <h3>
                  {account.name}
                </h3>

                <span>
                  {account.type === "cash" &&
                    "Physical money"}

                  {account.type === "bank" &&
                    "Bank account"}

                  {account.type === "wallet" &&
                    "Digital money"}

                  {account.type === "savings" &&
                    "Long-term savings"}

                  {![
                    "cash",
                    "bank",
                    "wallet",
                    "savings",
                  ].includes(account.type) &&
                    "Financial account"}
                </span>

              </div>


              {/* BALANCE */}

              <div className="account-detail-balance">

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

          ))}


          {/* ADD CARD */}

          <button
            className="account-add-card"
            onClick={() =>
              setShowAddAccount(true)
            }
          >

            <div className="account-add-icon">

              <Plus size={24} />

            </div>

            <strong>
              Add New Account
            </strong>

            <span>
              Track another source of money
            </span>

          </button>

        </div>

      </section>


      {/* ================= ADD MODAL ================= */}

      {showAddAccount && (

        <AddAccountModal
          onClose={() =>
            setShowAddAccount(false)
          }
          onAddAccount={
            handleAddAccount
          }
        />

      )}


      {/* ================= EDIT MODAL ================= */}

      {editingAccount && (

        <div className="edit-account-overlay">

          <div className="edit-account-modal">

            <div className="edit-account-header">

              <div>

                <h2>
                  Edit Account
                </h2>

                <p>
                  Update your account details
                </p>

              </div>


              <button
                onClick={() =>
                  setEditingAccount(null)
                }
              >
                ×
              </button>

            </div>


            <label>
              Account name
            </label>

            <input
              value={editingAccount.name}
              onChange={(event) =>
                setEditingAccount({
                  ...editingAccount,
                  name: event.target.value,
                })
              }
            />


            <label>
              Current balance
            </label>

            <input
              type="number"
              value={editingAccount.balance}
              onChange={(event) =>
                setEditingAccount({
                  ...editingAccount,
                  balance:
                    Number(
                      event.target.value
                    ),
                })
              }
            />


            <div className="edit-account-buttons">

              <button
                onClick={() =>
                  setEditingAccount(null)
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

      </section>

    </main>

  );
}

export default Accounts;