import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/user/Movies";
import MyBookings from "./pages/user/MyBookings";
import ScreeningTime from "./pages/user/ScreeningTime";
import SelectSeat from "./pages/user/SelectSeat";
import AdminDashboard from "./pages/admin/AdminDashboard";

function AppContent() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setToken={setToken} setRole={setRole} />}
      />
      <Route path="/register" element={<Register />} />

      <Route
        path="/movies"
        element={
          token ? (
            <Layout
              token={token}
              role={role}
              setToken={setToken}
              setRole={setRole}
            >
              <Movies />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/my-bookings"
        element={
          token ? (
            <Layout
              token={token}
              role={role}
              setToken={setToken}
              setRole={setRole}
            >
              <MyBookings />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/book/:id"
        element={
          token ? (
            <Layout
              token={token}
              role={role}
              setToken={setToken}
              setRole={setRole}
            >
              <ScreeningTime />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/seats/:id"
        element={
          token ? (
            <Layout
              token={token}
              role={role}
              setToken={setToken}
              setRole={setRole}
            >
              <SelectSeat />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          token && role === "admin" ? (
            <Layout
              token={token}
              role={role}
              setToken={setToken}
              setRole={setRole}
            >
              <AdminDashboard />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/contact"
        element={
          <Layout
            token={token}
            role={role}
            setToken={setToken}
            setRole={setRole}
          >
            <div className="p-6">Contact Page</div>
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout
            token={token}
            role={role}
            setToken={setToken}
            setRole={setRole}
          >
            <div className="p-6">About Us Page</div>
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={token ? (role === "admin" ? "/admin" : "/movies") : "/login"}
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}
