import { Screening, Movie, Theater } from "./AdminDashboard";
import axios from "axios";
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import api from "../../api";

interface ScreeningsTabProps {
  screenings: Screening[];
  setScreenings: (screenings: Screening[]) => void;
  token: string | null;
  movies: Movie[];
  theaters: Theater[];
}

export default function ScreeningsTab({
  screenings,
  setScreenings,
  token,
  movies,
  theaters,
}: ScreeningsTabProps) {
  const [movieId, setMovieId] = useState<number | "">("");
  const [theaterId, setTheaterId] = useState<number | "">("");
  const [startTime, setStartTime] = useState("");

  const [rowStart, setRowStart] = useState("A");
  const [rowEnd, setRowEnd] = useState("F");
  const [seatStart, setSeatStart] = useState(1);
  const [seatEnd, setSeatEnd] = useState(10);

  const generateSeats = () => {
    const seats: string[] = [];
    const startCode = rowStart.toUpperCase().charCodeAt(0);
    const endCode = rowEnd.toUpperCase().charCodeAt(0);
    for (let r = startCode; r <= endCode; r++) {
      const rowLetter = String.fromCharCode(r);
      for (let s = seatStart; s <= seatEnd; s++) {
        seats.push(`${rowLetter}${s}`);
      }
    }
    return seats;
  };

  const handleAddScreening = async () => {
    if (!movieId || !theaterId || !startTime || !token) return;

    try {
      const res = await api.post(
        "/screenings",
        { movieId, theaterId, startTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newScreening = res.data;
      const seatLayout = generateSeats();

      await api.post(
        `/screenings/${newScreening.id}/seats`,
        { seatNumbers: seatLayout },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScreenings([...screenings, newScreening]);
      setMovieId("");
      setTheaterId("");
      setStartTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to add screening");
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "var(--bg-darker)" }}>
        <Stack spacing={2} direction="row" flexWrap="wrap" alignItems="center">
          <TextField
            select
            label="Select Movie"
            value={movieId}
            onChange={(e) => setMovieId(Number(e.target.value))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Select Movie</MenuItem>
            {movies.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Theater"
            value={theaterId}
            onChange={(e) => setTheaterId(Number(e.target.value))}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Select Theater</MenuItem>
            {theaters.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            onClick={handleAddScreening}
            sx={{ backgroundColor: "var(--success)" }}
          >
            Add Screening
          </Button>
        </Stack>

        <Stack
          spacing={2}
          mt={2}
          direction="row"
          flexWrap="wrap"
          alignItems="center"
        >
          <Typography>Rows:</Typography>
          <TextField
            value={rowStart}
            onChange={(e) => setRowStart(e.target.value.toUpperCase())}
            inputProps={{ maxLength: 1 }}
            sx={{ width: 60 }}
          />
          <Typography>to</Typography>
          <TextField
            value={rowEnd}
            onChange={(e) => setRowEnd(e.target.value.toUpperCase())}
            inputProps={{ maxLength: 1 }}
            sx={{ width: 60 }}
          />

          <Typography>Seats per row:</Typography>
          <TextField
            type="number"
            value={seatStart}
            onChange={(e) => setSeatStart(Number(e.target.value))}
            sx={{ width: 80 }}
          />
          <Typography>to</Typography>
          <TextField
            type="number"
            value={seatEnd}
            onChange={(e) => setSeatEnd(Number(e.target.value))}
            sx={{ width: 80 }}
          />
        </Stack>
      </Paper>

      <Stack spacing={2}>
        {screenings.map((s) => (
          <Paper key={s.id} sx={{ p: 2, backgroundColor: "var(--bg-darker)" }}>
            <Typography>
              Movie:{" "}
              {movies.find((m) => m.id === s.movieId)?.title || s.movieId}
            </Typography>
            <Typography>
              Theater:{" "}
              {theaters.find((t) => t.id === s.theaterId)?.name || s.theaterId}
            </Typography>
            <Typography>
              Start Time: {new Date(s.startTime).toLocaleString()}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
