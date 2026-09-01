import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import YearReport from "./pages/YearReport";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/accounts"
          element={<Accounts />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/budgets"
          element={<Budgets />}
        />

        <Route
          path="/goals"
          element={<Goals />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/reports/:year"
          element={<YearReport />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;