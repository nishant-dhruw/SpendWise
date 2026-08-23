import {
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import AddAccountModal from "./AddAccountModal";

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
  const handleAddAccount = (account: Account) => {
    setAccounts((currentAccounts) => [
      ...currentAccounts,
      account,
    ]);
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

              <strong>
                ₹{account.balance.toLocaleString("en-IN")}
              </strong>

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

    </article>
    
  );
}

export default AccountsCard;