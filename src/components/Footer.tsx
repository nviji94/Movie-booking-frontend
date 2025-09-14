import { Box, Typography } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        textAlign: "center",
        color: "black",
        bgcolor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        boxShadow: "0 -4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <CopyrightIcon fontSize="small" />
      <Typography variant="body2">
        {new Date().getFullYear()} Movie Booking App. All rights reserved.
      </Typography>
    </Box>
  );
}
