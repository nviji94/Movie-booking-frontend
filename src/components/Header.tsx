import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🎬 Welcome to Movie Booking App
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
