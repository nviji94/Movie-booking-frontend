import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Movie } from "./AdminDashboard";
import api from "../../api";

interface MoviesTabProps {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  token: string | null;
}

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance"];

export default function MoviesTab({
  movies,
  setMovies,
  token,
}: MoviesTabProps) {
  const [title, setTitle] = useState("");
  const [durationMin, setDurationMin] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [cast, setCast] = useState("");
  const [director, setDirector] = useState("");
  const [rating, setRating] = useState<number>(6);
  const [poster, setPoster] = useState<File | null>(null);
  const [genre, setGenre] = useState("");

  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formError, setFormError] = useState("");

  const handlePosterChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPoster(e.target.files[0]);
  };

  const resetForm = () => {
    setTitle("");
    setDurationMin("");
    setDescription("");
    setCast("");
    setDirector("");
    setRating(6);
    setPoster(null);
    setGenre("");
  };

  const handleAddMovie = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedCast = cast.trim();
    const trimmedDirector = director.trim();
    const trimmedGenre = genre.trim();

    if (!trimmedTitle || !durationMin || !trimmedDirector || !trimmedGenre) {
      setFormError("All required fields must be filled.");
      return;
    }

    if (!/^[A-Z]/.test(trimmedTitle)) {
      setFormError("Movie title must start with a capital letter.");
      return;
    }

    const duplicate = movies.find(
      (m) =>
        m.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        m.director?.toLowerCase() === trimmedDirector.toLowerCase()
    );

    if (duplicate) {
      setFormError(
        `Movie "${trimmedTitle}" by "${trimmedDirector}" already exists.`
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("durationMin", durationMin.toString());
      formData.append("description", trimmedDescription);
      formData.append("cast", trimmedCast);
      formData.append("director", trimmedDirector);
      formData.append("rating", rating.toString());
      formData.append("genre", trimmedGenre);
      if (poster) formData.append("poster", poster);

      const res = await api.post("/movies", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMovies([...movies, res.data]);
      resetForm();
    } catch (err) {
      console.error("Add movie error:", err);
      setFormError("Failed to add movie.");
    }
  };

  const handleUpdateMovie = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingMovie || !token) return;

    setFormError("");
    const trimmedTitle = title.trim();
    const trimmedDirector = director.trim();
    const trimmedGenre = genre.trim();
    const trimmedDescription = description.trim();
    const trimmedCast = cast.trim();

    if (!trimmedTitle || !durationMin || !trimmedDirector || !trimmedGenre) {
      setFormError("All required fields must be filled.");
      return;
    }

    if (!/^[A-Z]/.test(trimmedTitle)) {
      setFormError("Movie title must start with a capital letter.");
      return;
    }

    const duplicate = movies.find(
      (m) =>
        m.id !== editingMovie.id &&
        m.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        m.director?.toLowerCase() === trimmedDirector.toLowerCase()
    );

    if (duplicate) {
      setFormError(
        `Movie "${trimmedTitle}" by "${trimmedDirector}" already exists.`
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("durationMin", durationMin.toString());
      formData.append("description", trimmedDescription);
      formData.append("cast", trimmedCast);
      formData.append("director", trimmedDirector);
      formData.append("rating", rating.toString());
      formData.append("genre", trimmedGenre);
      if (poster) formData.append("poster", poster);

      const res = await api.put(
        `/movies/${editingMovie.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMovies(movies.map((m) => (m.id === editingMovie.id ? res.data : m)));
      resetForm();
      setEditingMovie(null);
    } catch (err) {
      console.error("Update movie error:", err);
      setFormError("Failed to update movie.");
    }
  };

  const handleDeleteMovie = async (id: number) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await api.delete(`/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(movies.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie");
    }
  };

  return (
    <Box className="flex flex-col items-center w-full px-2">
      {/* FORM */}
      <Paper className="p-4 sm:p-6 mb-6 bg-gray-800 rounded-lg w-full max-w-md">
        <Typography className="text-lg sm:text-xl font-bold mb-2">
          {editingMovie ? "Edit Movie" : "Add Movie"}
        </Typography>

        {formError && (
          <Typography className="text-xs sm:text-sm text-red-500 mb-2">
            {formError}
          </Typography>
        )}

        <Stack
          spacing={2}
          component="form"
          onSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Duration (minutes)"
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            size="small"
          />
          <TextField
            label="Cast (comma separated)"
            value={cast}
            onChange={(e) => setCast(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Director"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            fullWidth
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              label="Genre"
            >
              {genres.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Rating (6-10)"
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            inputProps={{ min: 6, max: 10 }}
            fullWidth
            required
            size="small"
          />
          <Button variant="contained" component="label" className="text-sm">
            Upload Poster
            <input type="file" hidden onChange={handlePosterChange} />
          </Button>
          <Button type="submit" variant="contained" className="text-sm">
            {editingMovie ? "Update Movie" : "Add Movie"}
          </Button>
          {editingMovie && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setEditingMovie(null);
                resetForm();
              }}
              className="text-sm"
            >
              Cancel Edit
            </Button>
          )}
        </Stack>
      </Paper>

      {/* MOVIES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {movies.map((movie) => (
          <Paper
            key={movie.id}
            className="p-4 bg-gray-800 rounded-lg flex flex-col h-80"
          >
            <div className="flex-1 flex flex-col mb-2">
              <Typography variant="subtitle1" fontWeight="bold">
                {movie.title}
              </Typography>
              <Typography className="mt-1">
                Duration: {movie.durationMin} mins
              </Typography>
              <Typography>Rating: {movie.rating}/10</Typography>
              {movie.genre && <Typography>Genre: {movie.genre}</Typography>}
              {movie.cast && <Typography>Cast: {movie.cast}</Typography>}
              {movie.director && (
                <Typography>Director: {movie.director}</Typography>
              )}

              {/* Scrollable description */}
              {movie.description && (
                <Paper className="bg-gray-700 p-2 rounded-md mt-2 flex-1 overflow-y-auto max-h-20">
                  <Typography className="text-sm">
                    {movie.description}
                  </Typography>
                </Paper>
              )}
            </div>

            <Stack direction="row" spacing={1} mt="auto">
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setEditingMovie(movie);
                  setTitle(movie.title);
                  setDurationMin(movie.durationMin);
                  setDescription(movie.description || "");
                  setCast(movie.cast || "");
                  setDirector(movie.director || "");
                  setGenre(movie.genre || genres[0]);
                  setRating(movie.rating ?? 6);
                  setPoster(null);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDeleteMovie(movie.id)}
              >
                Delete
              </Button>
            </Stack>
          </Paper>
        ))}
      </div>
    </Box>
  );
}
