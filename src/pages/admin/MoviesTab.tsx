import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Movie } from "./AdminDashboard";
import { Box, TextField, Button, Typography, Paper, Stack } from "@mui/material";

interface MoviesTabProps {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  token: string | null;
}

export default function MoviesTab({ movies, setMovies, token }: MoviesTabProps) {
  const [title, setTitle] = useState("");
  const [durationMin, setDurationMin] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [cast, setCast] = useState("");
  const [director, setDirector] = useState("");
  const [rating, setRating] = useState<number>(6);
  const [poster, setPoster] = useState<File | null>(null);

  const handlePosterChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPoster(e.target.files[0]);
  };

  const handleAddMovie = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !durationMin || !token) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("durationMin", durationMin.toString());
      formData.append("description", description);
      formData.append("cast", cast);
      formData.append("director", director);
      formData.append("rating", rating.toString());
      if (poster) formData.append("poster", poster);

      const res = await axios.post("http://localhost:4000/movies", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setMovies([...movies, res.data]);

      setTitle("");
      setDurationMin("");
      setDescription("");
      setCast("");
      setDirector("");
      setRating(6);
      setPoster(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add movie");
    }
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "var(--bg-darker)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Add Movie
        </Typography>

        <Stack spacing={2} component="form" onSubmit={handleAddMovie}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ input: { color: "var(--text-light)" }, label: { color: "var(--text-light)" } }}
          />
          <TextField
            label="Duration (minutes)"
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
            fullWidth
            required
            sx={{ input: { color: "var(--text-light)" }, label: { color: "var(--text-light)" } }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ input: { color: "var(--text-light)" }, label: { color: "var(--text-light)" } }}
          />
          <TextField
            label="Cast (comma separated)"
            value={cast}
            onChange={(e) => setCast(e.target.value)}
            fullWidth
            sx={{ input: { color: "var(--text-light)" }, label: { color: "var(--text-light)" } }}
          />
          <TextField
            label="Director"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            fullWidth
            sx={{ input: { color: "var(--text-light)" }, label: { color: "var(--text-light)" } }}
          />
          <TextField
            label="Rating (6-10)"
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            inputProps={{ min: 6, max: 10 }}
            fullWidth
            required
            sx={{ input: { color: "var(--text-light)" }, label: { color: "var(--text-light)" } }}
          />
          <Button variant="contained" component="label" sx={{ backgroundColor: "var(--success)" }}>
            Upload Poster
            <input type="file" hidden onChange={handlePosterChange} />
          </Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "var(--success)" }}>
            Add Movie
          </Button>
        </Stack>
      </Paper>

      <Stack spacing={2}>
        {movies.map((movie) => (
          <Paper key={movie.id} sx={{ p: 2, backgroundColor: "var(--bg-darker)" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {movie.title}
            </Typography>
            <Typography>Duration: {movie.durationMin} mins</Typography>
            <Typography>Rating: {movie.rating}/10</Typography>
            {movie.description && <Typography>Description: {movie.description}</Typography>}
            {movie.cast && <Typography>Cast: {movie.cast}</Typography>}
            {movie.director && <Typography>Director: {movie.director}</Typography>}
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
