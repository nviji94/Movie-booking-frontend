import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/user/Movies";
import MyBookings from "./pages/user/MyBookings";
import ScreeningTime from "./pages/user/ScreeningTime";
import SelectSeat from "./pages/user/SelectSeat";
import AdminDashboard from "./pages/admin/AdminDashboard";

// ✅ Navigation Tabs Component with Logout
function NavigationTabs({
  setToken,
  setRole,
  role,
}: {
  setToken: any;
  setRole: any;
  role: string | null;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const isUser = role !== "admin"; // Only show tabs for regular users

  const tabNameToIndex: Record<string, number> = {
    "/movies": 0,
    "/my-bookings": 1,
    "/contact": 2,
    "/about": 3,
  };
  const indexToTabName = ["/movies", "/my-bookings", "/contact", "/about"];
  const currentPath = location.pathname;
  const initialTab = tabNameToIndex[currentPath] ?? false;

  const [selectedTab, setSelectedTab] = useState(initialTab);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    navigate(indexToTabName[newValue]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🎬 Movie Booking
        </Typography>

        {isUser && (
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Movies" />
            <Tab label="My Bookings" />
            <Tab label="Contact" />
            <Tab label="About Us" />
          </Tabs>
        )}

        <Typography
          onClick={handleLogout}
          sx={{ cursor: "pointer", ml: 3, color: "white", fontWeight: "bold" }}
        >
          Logout
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

// ✅ Main App
function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Router>
      {/* Show navbar only if logged in */}
      {token && <NavigationTabs setToken={setToken} setRole={setRole} role={role} />}

      <Routes>
        {/* Auth */}
        <Route
          path="/login"
          element={<Login setToken={setToken} setRole={setRole} />}
        />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/movies"
          element={token ? <Movies /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-bookings"
          element={token ? <MyBookings /> : <Navigate to="/login" />}
        />
        <Route
          path="/book/:id"
          element={token ? <ScreeningTime /> : <Navigate to="/login" />}
        />
        <Route
          path="/seats/:id"
          element={token ? <SelectSeat /> : <Navigate to="/login" />}
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            token && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Contact & About pages */}
        <Route path="/contact" element={<div className="p-6">📞 Contact Page</div>} />
        <Route path="/about" element={<div className="p-6">ℹ️ About Us Page</div>} />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to={token ? (role === "admin" ? "/admin" : "/movies") : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
