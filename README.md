# 💚 SpendWise

### Know where your money goes.

SpendWise is a full-stack personal finance management application designed to help users track their money, manage accounts, record income and expenses, monitor budgets and goals, and understand their spending through reports and analytics.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected application routes

### 💳 Account Management

- Create financial accounts
- Support for cash, bank, wallet, savings and other account types
- Track account balances
- Edit accounts
- Delete accounts with transaction protection

### 💰 Transaction Management

- Record income and expenses
- Categorize transactions
- Add descriptions and dates
- Edit transactions
- Delete transactions
- Automatic account balance updates

### 📊 Dashboard

- Total money across accounts
- Current month's expenses
- Current month's savings
- Spending overview
- Recent transactions
- Budget overview

### 🎯 Budget Management

- Create spending budgets
- Track spending against budgets
- Category-based expense tracking
- Monitor remaining budget amounts

### 🏆 Goals

- Create financial goals
- Track progress toward goals
- Monitor target amounts

### 📈 Reports & Analytics

- Spending by category
- Income and expense analysis
- Monthly spending insights
- Yearly reports
- Financial trends

### ⚙️ Settings

- User profile management interface
- Currency preferences
- Notification preferences
- Appearance preferences
- Account management options

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Lucide React

### Backend

- Node.js
- Express.js
- JavaScript
- JWT
- bcrypt

### Database

- MongoDB
- Mongoose

### Development Tools

- VS Code
- Git
- GitHub
- MongoDB Atlas

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│       React + TypeScript     │
│          Frontend            │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│       Node.js + Express      │
│           Backend            │
└──────────────┬───────────────┘
               │
               │ Mongoose
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│          Database            │
└──────────────────────────────┘
```

---

## 📁 Project Structure

```text
SpendWise/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   └── package.json
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── public/
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/nishant-dhruw/SpendWise.git
cd SpendWise
```

### 2. Install frontend dependencies

```bash
cd web
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Never commit your `.env` file to GitHub.**

### 5. Start the backend

From the `backend` directory:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Start the frontend

From the `web` directory:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔐 Security

SpendWise uses:

- JWT authentication
- bcrypt password hashing
- Protected API routes
- User-specific database access
- Account ownership validation
- Environment variables for sensitive configuration

---

## 📸 Screenshots

Screenshots will be added after testing and UI polishing.

---

## 🗺️ Roadmap

### Completed

- [x] User authentication
- [x] Protected routes
- [x] Account management
- [x] Transaction management
- [x] Dashboard
- [x] Budgets
- [x] Goals
- [x] Reports
- [x] Yearly reports
- [x] Settings interface

### Planned

- [ ] Change password
- [ ] Persistent user preferences
- [ ] Dark mode
- [ ] Notification preferences
- [ ] Account deletion workflow
- [ ] Account-to-account transfers
- [ ] Improved analytics
- [ ] Production deployment
- [ ] Android application

---

## 📌 Project Status

**Version:** 1.0

**Status:** Active Development

SpendWise v1.0 represents the current stable baseline of the application.

The project will continue to evolve through bug fixes, improvements, and new features.

---

## 👨‍💻 Author

**Nishant Dhruw**

GitHub: https://github.com/nishant-dhruw/SpendWise

---

## 📄 License

This project is currently developed as a personal portfolio and learning project.