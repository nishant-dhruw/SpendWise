import {
  Plus,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import AddAccountModal from "./AddAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";

import "./AccountsCard.css";
interface Account {
  name: string;
  type: string;
  balance: number;
}
interface AccountsCardProps {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

function AccountsCard({
  accounts,
  setAccounts,
}: AccountsCardProps) {
  const [showAddAccount, setShowAddAccount] = useState(false);

  const [accountToDelete, setAccountToDelete] =
    useState<Account | null>(null);
  const handleAddAccount = (account: Account) => {
    setAccounts((currentAccounts) => [
      ...currentAccounts,
      account,
    ]);
  };

  const handleDeleteAccount = (account: Account) => {
      setAccountToDelete(account);
    };

    const confirmDeleteAccount = () => {

      if (!accountToDelete) {
        return;
      }

      setAccounts((currentAccounts) =>
        currentAccounts.filter(
          (currentAccount) =>
            currentAccount !== accountToDelete
        )
      );

      setAccountToDelete(null);
    };

  return (
    <article className="accounts-card">

      {/* Header */}
      <div className="accounts-card-header">

        <div>
          <h3>Your Money</h3>

          <p>
            Accounts & balances
          </p>
        </div>

        <button
          className="accounts-add-button"
          onClick={() => setShowAddAccount(true)}
        >
          <Plus size={16} />
        </button>

      </div>


      {/* Accounts */}
        <div className="accounts-list">

          {accounts.map((account) => (
            <div
              className="account-row"
              key={account.name}
            >

              <div className="account-left">

                <div className={`account-icon ${account.type}`}>
                  {account.type === "cash" && "₹"}
                  {account.type === "bank" && "🏦"}
                  {account.type === "wallet" && "💳"}
                  {account.type === "savings" && "🎯"}
                </div>

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

              </div>

              <div className="account-actions">

                <strong>
                  ₹{account.balance.toLocaleString("en-IN")}
                </strong>

                <button
                  className="account-delete-button"
                  onClick={() => handleDeleteAccount(account)}
                  title="Delete account"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          ))}

        </div>


      {/* View all */}
      <button className="view-all-accounts">

        <span>
          View all accounts
        </span>

        <ArrowUpRight size={15} />

      </button>
      {showAddAccount && (
        <AddAccountModal
          onClose={() => setShowAddAccount(false)}
          onAddAccount={handleAddAccount}
        />
      )}

      {accountToDelete && (
        <DeleteAccountModal
          account={accountToDelete}
          onClose={() => setAccountToDelete(null)}
          onConfirm={confirmDeleteAccount}
        />
      )}

    </article>
    
  );
}

export default AccountsCard;