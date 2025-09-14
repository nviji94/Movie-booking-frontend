import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/logo.png";

interface Props {
  setToken: (val: string | null) => void;
  setRole: (val: string | null) => void;
  role: string | null;
}

export default function NavigationTabs({ setToken, setRole, role }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const isUser = role !== "admin";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const menuItems = [
    { label: "Movies", path: "/movies" },
    { label: "My Bookings", path: "/my-bookings" },
    //{ label: "Contact", path: "/contact" },
    //{ label: "About Us", path: "/about" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            flexGrow: 1,
          }}
          onClick={() => navigate("/movies")}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Movie Booking Logo"
            sx={{
              width: { xs: "50px", sm: "50px", md: "70px" },
              height: "auto",
              mr: 1,
            }}
          />

          {/* Text */}
          <Typography variant="h6" sx={{ color: "black" }}>
            Movie Booking
          </Typography>
        </Box>

        {/* Desktop Tabs */}
        {isUser && !isMobile && (
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            textColor="inherit"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "black",
              },
              "& .MuiTab-root": {
                color: "black",
                textTransform: "none",
                minWidth: 80,
              },
              "&.Mui-selected": {
                color: "black",
              },
              "&.MuiButtonBase-root": {
                backgroundColor: "transparent",
              },
            }}
          >
            {menuItems.map((item) => (
              <Tab key={item.path} label={item.label} disableRipple />
            ))}
          </Tabs>
        )}

        {/* Mobile Drawer (Hamburger Menu) */}
        {isUser && isMobile && (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: 250,
                  height: "auto",
                  maxHeight: "100vh",
                },
              }}
            >
              {/* Drawer Header with Close Icon */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 2, borderBottom: "1px solid #ddd" }}
              >
                <Typography variant="h6">Menu</Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Menu items all at the top */}
              <List>
                {menuItems.map((item, index) => (
                  <ListItem disablePadding key={item.path}>
                    <ListItemButton
                      onClick={() => {
                        setSelectedTab(index);
                        navigate(item.path);
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary="Logout" sx={{ color: "red" }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Drawer>
          </>
        )}

        {/* Logout button on desktop */}
        {!isMobile && (
          <Typography
            onClick={handleLogout}
            sx={{
              cursor: "pointer",
              ml: 3,
              color: "black",
            }}
          >
            Logout
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
