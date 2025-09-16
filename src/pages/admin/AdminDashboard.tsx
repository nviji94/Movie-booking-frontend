import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import MoviesTab from "./MoviesTab";
import TheatersTab from "./TheatersTab";
import ScreeningsTab from "./ScreeningsTab";
import api from "../../api";

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState<
    "movies" | "theaters" | "screenings"
  >("movies");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    api
      .get("/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMovies(res.data))
      .catch(console.error);

    api
      .get("/theaters", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTheaters(res.data))
      .catch(console.error);

    api
      .get("/screenings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setScreenings(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
      }}
    >
      <Typography variant="h3" fontWeight="bold" mb={4}>
        Admin Dashboard
      </Typography>

      <Stack direction="row" spacing={2} mb={4}>
        {["movies", "theaters", "screenings"].map((tab) => (
          <Button
            key={tab}
            variant={currentTab === tab ? "contained" : "outlined"}
            onClick={() =>
              setCurrentTab(tab as "movies" | "theaters" | "screenings")
            }
            sx={{
              color:
                currentTab === tab ? "var(--text-light)" : "var(--text-light)",
              borderColor: "var(--text-light)",
              "&:hover": {
                backgroundColor:
                  currentTab === tab
                    ? "var(--button-active)"
                    : "var(--button-hover)",
                borderColor: "var(--text-light)",
              },
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </Stack>

      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 2, backgroundColor: "var(--bg-darker)" }}
      >
        {currentTab === "movies" && (
          <MoviesTab movies={movies} setMovies={setMovies} token={token} />
        )}
        {currentTab === "theaters" && (
          <TheatersTab
            theaters={theaters}
            setTheaters={setTheaters}
            token={token}
          />
        )}
        {currentTab === "screenings" && (
          <ScreeningsTab
            screenings={screenings}
            setScreenings={setScreenings}
            token={token}
            movies={movies}
            theaters={theaters}
          />
        )}
      </Paper>
    </Box>
  );
}

// Interfaces
export interface Movie {
  id: number;
  title: string;
  durationMin: number;
  screenings?: Screening[];
  rating?: number;
  description?: string;
  cast?: string;
  director?: string;
  posterUrl?: string;
  genre?: string;
}

export interface Theater {
  id: number;
  name: string;
  location: string;
}

export interface Screening {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
}
