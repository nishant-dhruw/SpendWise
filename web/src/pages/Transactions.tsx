import { useEffect, useState } from "react";

import {
    Plus,
    Trash2,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Pencil,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AddTransactionModal from "../components/AddTransactionModal";

import "./Transactions.css";


// =========================================================
// TRANSACTION INTERFACE
// =========================================================

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


// =========================================================
// ACCOUNT INTERFACE
// =========================================================

interface Account {

    _id?: string;

    name: string;

    type: string;

    balance: number;

}


// =========================================================
// BACKEND TRANSACTION INTERFACE
// =========================================================

interface BackendTransaction {

    _id: string;

    type:
        | "income"
        | "expense";

    category: string;

    description: string;

    amount: number;

    date: string;

    account: string;

}


// =========================================================
// COMPONENT
// =========================================================

function Transactions() {


    // =====================================================
    // STATE
    // =====================================================

    const [
        transactions,
        setTransactions,
    ] =
        useState<Transaction[]>([]);


    const [
        accounts,
        setAccounts,
    ] =
        useState<Account[]>([]);


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        error,
        setError,
    ] =
        useState("");


    const [
        showAddTransaction,
        setShowAddTransaction,
    ] =
        useState(false);


    const [
        search,
        setSearch,
    ] =
        useState("");


    const [
        typeFilter,
        setTypeFilter,
    ] =
        useState("all");


    const [
        categoryFilter,
        setCategoryFilter,
    ] =
        useState("all");


    const [
        dateFilter,
        setDateFilter,
    ] =
        useState("all");


    const [
        sortOrder,
        setSortOrder,
    ] =
        useState<
            "newest"
            | "oldest"
        >(
            "newest"
        );


    const [
        transactionToDelete,
        setTransactionToDelete,
    ] =
        useState<Transaction | null>(
            null
        );


    const [
        transactionToEdit,
        setTransactionToEdit,
    ] =
        useState<Transaction | null>(
            null
        );


    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {

        return (
            localStorage.getItem("token") ||
            sessionStorage.getItem("token")
        );

    };


    // =====================================================
    // FETCH ACCOUNTS + TRANSACTIONS
    // =====================================================

    const fetchData = async () => {

        try {

            setLoading(true);

            setError("");


            const token =
                getToken();


            if (!token) {

                setError(
                    "Authentication token not found. Please login again."
                );

                return;

            }


            // =================================================
            // FETCH ACCOUNTS
            // =================================================

            const accountsResponse =
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


            const accountsData =
                await accountsResponse.json();


            if (!accountsResponse.ok) {

                throw new Error(
                    accountsData.message ||
                    "Failed to fetch accounts."
                );

            }


            const formattedAccounts:
                Account[] =
                accountsData.accounts.map(
                    (account: Account) => ({

                        ...account,

                        type:
                            account.type.toLowerCase(),

                    })
                );


            setAccounts(
                formattedAccounts
            );


            // =================================================
            // FETCH TRANSACTIONS
            // =================================================

            const transactionsResponse =
                await fetch(
                    "http://localhost:5000/api/transactions",
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


            const transactionsData =
                await transactionsResponse.json();


            if (!transactionsResponse.ok) {

                throw new Error(
                    transactionsData.message ||
                    "Failed to fetch transactions."
                );

            }


            // =================================================
            // CONVERT BACKEND TRANSACTIONS
            // TO FRONTEND TRANSACTIONS
            // =================================================

            const formattedTransactions:
                Transaction[] =

                transactionsData.transactions.map(
                    (
                        transaction:
                            BackendTransaction
                    ) => {

                        const account =
                            formattedAccounts.find(
                                (
                                    currentAccount
                                ) =>
                                    currentAccount._id ===
                                    transaction.account
                            );


                        return {

                            id:
                                transaction._id,

                            type:
                                transaction.type,

                            category:
                                transaction.category,

                            description:
                                transaction.description,

                            amount:
                                Number(
                                    transaction.amount
                                ),

                            date:
                                transaction.date.split("T")[0],

                            accountName:
                                account?.name ||
                                "Unknown Account",

                        };

                    }
                );


            setTransactions(
                formattedTransactions
            );


        } catch (error) {

            console.error(
                "Error loading transactions:",
                error
            );


            if (
                error instanceof Error
            ) {

                setError(
                    error.message
                );

            }

            else {

                setError(
                    "Unable to load transactions."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchData();

    }, []);


    // =====================================================
    // ADD TRANSACTION
    // =====================================================

    const handleAddTransaction = async (
        newTransaction: Transaction
    ): Promise<void> => {


        const token =
            getToken();


        if (!token) {

            throw new Error(
                "Authentication token not found."
            );

        }


        // =================================================
        // FIND ACCOUNT
        // =================================================

        const selectedAccount =
            accounts.find(
                (account) =>
                    account.name ===
                    newTransaction.accountName
            );


        if (
            !selectedAccount ||
            !selectedAccount._id
        ) {

            throw new Error(
                "Selected account was not found."
            );

        }


        // =================================================
        // REQUEST BODY
        // =================================================

        const requestBody = {

            type:
                newTransaction.type,

            amount:
                Number(
                    newTransaction.amount
                ),

            category:
                newTransaction.category,

            description:
                newTransaction.description,

            date:
                newTransaction.date,

            account:
                selectedAccount._id,

        };


        // =================================================
        // POST TO BACKEND
        // =================================================

        const response =
            await fetch(
                "http://localhost:5000/api/transactions",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        ),
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to add transaction."
            );

        }


        console.log(
            "Transaction added successfully:",
            data
        );


        // =================================================
        // REFRESH FROM DATABASE
        // =================================================

        await fetchData();


        setShowAddTransaction(
            false
        );

    };


    // =====================================================
    // EDIT TRANSACTION
    // =====================================================

    const handleEditTransaction = async (

        oldTransaction: Transaction,

        updatedTransaction: Transaction

    ): Promise<void> => {


        const token =
            getToken();


        if (!token) {

            throw new Error(
                "Authentication token not found."
            );

        }


        if (!oldTransaction.id) {

            throw new Error(
                "Transaction ID not found."
            );

        }


        // =================================================
        // FIND NEW ACCOUNT
        // =================================================

        const selectedAccount =
            accounts.find(
                (account) =>
                    account.name ===
                    updatedTransaction.accountName
            );


        if (
            !selectedAccount ||
            !selectedAccount._id
        ) {

            throw new Error(
                "Selected account was not found."
            );

        }


        // =================================================
        // REQUEST BODY
        // =================================================

        const requestBody = {

            type:
                updatedTransaction.type,

            amount:
                Number(
                    updatedTransaction.amount
                ),

            category:
                updatedTransaction.category,

            description:
                updatedTransaction.description,

            date:
                updatedTransaction.date,

            account:
                selectedAccount._id,

        };


        console.log(
            "Updating transaction:",
            requestBody
        );


        // =================================================
        // PUT TO BACKEND
        // =================================================

        const response =
            await fetch(
                `http://localhost:5000/api/transactions/${oldTransaction.id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        ),
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update transaction."
            );

        }


        console.log(
            "Transaction updated successfully:",
            data
        );


        // =================================================
        // REFRESH DATABASE DATA
        // =================================================

        await fetchData();


        setTransactionToEdit(
            null
        );

    };


    // =====================================================
    // DELETE TRANSACTION
    // =====================================================

    const handleDeleteTransaction = async (

        transaction: Transaction

    ): Promise<void> => {


        const token =
            getToken();


        if (!token) {

            throw new Error(
                "Authentication token not found."
            );

        }


        if (!transaction.id) {

            throw new Error(
                "Transaction ID not found."
            );

        }


        // =================================================
        // DELETE FROM BACKEND
        // =================================================

        const response =
            await fetch(
                `http://localhost:5000/api/transactions/${transaction.id}`,
                {
                    method: "DELETE",

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

            throw new Error(
                data.message ||
                "Failed to delete transaction."
            );

        }


        console.log(
            "Transaction deleted successfully:",
            data
        );


        // =================================================
        // REFRESH DATABASE DATA
        // =================================================

        await fetchData();


        setTransactionToDelete(
            null
        );

    };


    // =====================================================
    // FILTER TRANSACTIONS
    // =====================================================

    const filteredTransactions =

        transactions.filter(
            (transaction) => {


                const searchText =
                    search.toLowerCase();


                const matchesSearch =

                    transaction.description
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    transaction.accountName
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                const matchesType =

                    typeFilter === "all"

                    ||

                    transaction.type ===
                    typeFilter;


                const matchesCategory =

                    categoryFilter === "all"

                    ||

                    transaction.category ===
                    categoryFilter;


                const transactionDate =
                    new Date(
                        `${transaction.date}T00:00:00`
                    );


                const today =
                    new Date();


                const todayDate =
                    new Date(

                        today.getFullYear(),

                        today.getMonth(),

                        today.getDate()

                    );


                const matchesDate =
                    (() => {


                        if (
                            dateFilter === "all"
                        ) {

                            return true;

                        }


                        if (
                            dateFilter === "today"
                        ) {

                            return (

                                transactionDate.getFullYear() ===
                                todayDate.getFullYear()

                                &&

                                transactionDate.getMonth() ===
                                todayDate.getMonth()

                                &&

                                transactionDate.getDate() ===
                                todayDate.getDate()

                            );

                        }


                        if (
                            dateFilter === "week"
                        ) {

                            const startOfWeek =
                                new Date(
                                    todayDate
                                );


                            const day =
                                startOfWeek.getDay();


                            startOfWeek.setDate(

                                startOfWeek.getDate()
                                - day

                            );


                            const endOfWeek =
                                new Date(
                                    startOfWeek
                                );


                            endOfWeek.setDate(

                                endOfWeek.getDate()
                                + 6

                            );


                            endOfWeek.setHours(

                                23,
                                59,
                                59,
                                999

                            );


                            return (

                                transactionDate >=
                                startOfWeek

                                &&

                                transactionDate <=
                                endOfWeek

                            );

                        }


                        if (
                            dateFilter === "month"
                        ) {

                            return (

                                transactionDate.getFullYear() ===
                                todayDate.getFullYear()

                                &&

                                transactionDate.getMonth() ===
                                todayDate.getMonth()

                            );

                        }


                        if (
                            dateFilter === "lastMonth"
                        ) {

                            const lastMonth =
                                new Date(

                                    todayDate.getFullYear(),

                                    todayDate.getMonth() - 1,

                                    1

                                );


                            return (

                                transactionDate.getFullYear() ===
                                lastMonth.getFullYear()

                                &&

                                transactionDate.getMonth() ===
                                lastMonth.getMonth()

                            );

                        }


                        return true;

                    })();


                return (

                    matchesSearch

                    &&

                    matchesType

                    &&

                    matchesCategory

                    &&

                    matchesDate

                );

            }
        );


    // =====================================================
    // SORT TRANSACTIONS
    // =====================================================

    const sortedTransactions =

        [...filteredTransactions].sort(
            (a, b) => {


                const dateA =
                    new Date(
                        `${a.date}T00:00:00`
                    ).getTime();


                const dateB =
                    new Date(
                        `${b.date}T00:00:00`
                    ).getTime();


                return sortOrder === "newest"

                    ? dateB - dateA

                    : dateA - dateB;

            }
        );


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalIncome =

        transactions

            .filter(
                (transaction) =>
                    transaction.type ===
                    "income"
            )

            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    transaction.amount,

                0
            );


    const totalExpenses =

        transactions

            .filter(
                (transaction) =>
                    transaction.type ===
                    "expense"
            )

            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    transaction.amount,

                0
            );


    const netAmount =
        totalIncome -
        totalExpenses;


    // =====================================================
    // CATEGORY ICON
    // =====================================================

    const getCategoryIcon = (
        category: string
    ) => {


        if (category === "food") {
            return "🍔";
        }


        if (category === "transport") {
            return "🚕";
        }


        if (category === "shopping") {
            return "🛍️";
        }


        if (category === "salary") {
            return "💼";
        }


        if (category === "bills") {
            return "💡";
        }


        if (category === "entertainment") {
            return "🎮";
        }


        if (category === "health") {
            return "🏥";
        }


        if (category === "freelance") {
            return "💻";
        }


        return "💰";

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="transactions-page">

            <Sidebar />


            <section className="transactions-main">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="transactions-page-header">

                    <div>

                        <h1>
                            Transactions
                        </h1>

                        <p>
                            Manage your income
                            and expenses
                        </p>

                    </div>


                    <button

                        className="transactions-page-add"

                        onClick={() =>
                            setShowAddTransaction(
                                true
                            )
                        }

                    >

                        <Plus size={18} />

                        Add Transaction

                    </button>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        style={{
                            color: "#dc2626",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                        }}
                    >

                        {error}

                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="transactions-summary">


                    <div className="transaction-summary-card">

                        <span>
                            Total Income
                        </span>


                        <strong className="summary-income">

                            <ArrowUpRight
                                size={18}
                            />

                            ₹

                            {totalIncome.toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                    <div className="transaction-summary-card">

                        <span>
                            Total Expenses
                        </span>


                        <strong className="summary-expense">

                            <ArrowDownRight
                                size={18}
                            />

                            ₹

                            {totalExpenses.toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                    <div className="transaction-summary-card">

                        <span>
                            Net Amount
                        </span>


                        <strong

                            className={
                                netAmount >= 0
                                    ? "summary-income"
                                    : "summary-expense"
                            }

                        >

                            ₹

                            {netAmount.toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                </section>


                {/* =================================================
                    TRANSACTIONS CARD
                ================================================= */}

                <section className="transactions-page-card">


                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <div className="transactions-filters">


                        <div className="transaction-search">

                            <Search size={17} />

                            <input

                                type="text"

                                placeholder="Search transactions..."

                                value={search}

                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }

                            />

                        </div>


                        {/* TYPE */}

                        <select

                            value={typeFilter}

                            onChange={(event) =>
                                setTypeFilter(
                                    event.target.value
                                )
                            }

                        >

                            <option value="all">
                                All Types
                            </option>

                            <option value="income">
                                Income
                            </option>

                            <option value="expense">
                                Expense
                            </option>

                        </select>


                        {/* CATEGORY */}

                        <select

                            value={categoryFilter}

                            onChange={(event) =>
                                setCategoryFilter(
                                    event.target.value
                                )
                            }

                        >

                            <option value="all">
                                All Categories
                            </option>

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

                            <option value="salary">
                                Salary
                            </option>

                            <option value="freelance">
                                Freelance
                            </option>

                            <option value="other">
                                Other
                            </option>

                        </select>


                        {/* DATE */}

                        <select

                            value={dateFilter}

                            onChange={(event) =>
                                setDateFilter(
                                    event.target.value
                                )
                            }

                        >

                            <option value="all">
                                All Dates
                            </option>

                            <option value="today">
                                Today
                            </option>

                            <option value="week">
                                This Week
                            </option>

                            <option value="month">
                                This Month
                            </option>

                            <option value="lastMonth">
                                Last Month
                            </option>

                        </select>


                        {/* SORT */}

                        <select

                            value={sortOrder}

                            onChange={(event) =>
                                setSortOrder(

                                    event.target.value as
                                        | "newest"
                                        | "oldest"

                                )
                            }

                        >

                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>

                        </select>


                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="transactions-empty">

                            <div>
                                ⏳
                            </div>

                            <h3>
                                Loading transactions...
                            </h3>

                            <p>
                                Fetching your latest financial activity.
                            </p>

                        </div>

                    ) : filteredTransactions.length === 0 ? (

                        /* =================================================
                           EMPTY
                        ================================================= */

                        <div className="transactions-empty">

                            <div>
                                💸
                            </div>


                            <h3>
                                No transactions found
                            </h3>


                            <p>
                                Try changing your filters
                                or add a new transaction.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           TRANSACTION LIST
                        ================================================= */

                        <div className="transactions-page-list">


                            {sortedTransactions.map(
                                (transaction) => (

                                    <div

                                        className="transactions-page-row"

                                        key={
                                            transaction.id
                                        }

                                    >


                                        {/* LEFT */}

                                        <div className="transactions-page-left">


                                            <div

                                                className={
                                                    `transactions-page-icon ${transaction.category}`
                                                }

                                            >

                                                {getCategoryIcon(
                                                    transaction.category
                                                )}

                                            </div>


                                            <div>

                                                <strong>

                                                    {
                                                        transaction.description
                                                    }

                                                </strong>


                                                <span>

                                                    {
                                                        `${transaction.category} · ${transaction.accountName}`
                                                    }

                                                </span>


                                                <small>

                                                    {
                                                        transaction.date
                                                    }

                                                </small>

                                            </div>


                                        </div>


                                        {/* RIGHT */}

                                        <div className="transactions-page-right">


                                            <strong

                                                className={

                                                    transaction.type ===
                                                    "income"

                                                        ? "transaction-income"

                                                        : "transaction-expense"

                                                }

                                            >

                                                {
                                                    transaction.type ===
                                                    "income"
                                                        ? "+"
                                                        : "-"
                                                }

                                                {" "}₹

                                                {transaction.amount.toLocaleString(
                                                    "en-IN"
                                                )}

                                            </strong>


                                            {/* EDIT */}

                                            <button

                                                className="transaction-page-edit"

                                                onClick={() =>
                                                    setTransactionToEdit(
                                                        transaction
                                                    )
                                                }

                                                title="Edit transaction"

                                            >

                                                <Pencil size={15} />

                                            </button>


                                            {/* DELETE */}

                                            <button

                                                className="transaction-page-delete"

                                                onClick={() =>
                                                    setTransactionToDelete(
                                                        transaction
                                                    )
                                                }

                                                title="Delete transaction"

                                            >

                                                <Trash2 size={15} />

                                            </button>


                                        </div>


                                    </div>

                                )
                            )}


                        </div>

                    )}


                </section>


            </section>


            {/* =================================================
                ADD MODAL
            ================================================= */}

            {showAddTransaction && (

                <AddTransactionModal

                    onClose={() =>
                        setShowAddTransaction(
                            false
                        )
                    }

                    onAddTransaction={
                        handleAddTransaction
                    }

                    accounts={
                        accounts
                    }

                />

            )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {transactionToEdit && (

                <AddTransactionModal

                    transactionToEdit={
                        transactionToEdit
                    }

                    onClose={() =>
                        setTransactionToEdit(
                            null
                        )
                    }

                    onAddTransaction={
                        handleAddTransaction
                    }

                    onEditTransaction={
                        handleEditTransaction
                    }

                    accounts={
                        accounts
                    }

                />

            )}


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {transactionToDelete && (

                <div

                    className="delete-confirm-overlay"

                    onClick={() =>
                        setTransactionToDelete(
                            null
                        )
                    }

                >


                    <div

                        className="delete-confirm-modal"

                        onClick={(event) =>
                            event.stopPropagation()
                        }

                    >


                        <div className="delete-confirm-icon">

                            <Trash2 size={22} />

                        </div>


                        <h3>
                            Delete Transaction?
                        </h3>


                        <p>
                            Are you sure you want to
                            delete this transaction?
                        </p>


                        <div className="delete-confirm-details">

                            <strong>

                                {
                                    transactionToDelete.description
                                }

                            </strong>


                            <span

                                className={
                                    transactionToDelete.type ===
                                    "income"
                                        ? "transaction-income"
                                        : "transaction-expense"
                                }

                            >

                                {
                                    transactionToDelete.type ===
                                    "income"
                                        ? "+"
                                        : "-"
                                }

                                {" "}₹

                                {transactionToDelete.amount.toLocaleString(
                                    "en-IN"
                                )}

                            </span>

                        </div>


                        <p className="delete-confirm-note">

                            This will update the balance of{" "}

                            <strong>

                                {
                                    transactionToDelete.accountName
                                }

                            </strong>.

                        </p>


                        <div className="delete-confirm-actions">


                            <button

                                className="delete-cancel-button"

                                onClick={() =>
                                    setTransactionToDelete(
                                        null
                                    )
                                }

                            >

                                Cancel

                            </button>


                            <button

                                className="delete-confirm-button"

                                onClick={async () => {

                                    try {

                                        await handleDeleteTransaction(
                                            transactionToDelete
                                        );

                                    } catch (error) {

                                        console.error(
                                            "Delete transaction error:",
                                            error
                                        );

                                        if (
                                            error instanceof Error
                                        ) {

                                            setError(
                                                error.message
                                            );

                                        }

                                    }

                                }}

                            >

                                Delete

                            </button>


                        </div>


                    </div>


                </div>

            )}

        </main>

    );

}


export default Transactions;