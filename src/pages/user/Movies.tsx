import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import api from "../../api";

interface Movie {
  id: number;
  title: string;
  durationMin: number;
  rating: number;
  posterUrl?: string | null;
  genre?: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get("/movies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mappedMovies: Movie[] = res.data.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          durationMin: movie.durationMin,
          rating: movie.rating ?? 0,
          posterUrl: movie.posterUrl,
          genre: movie.genre,
        }));
        setMovies(mappedMovies);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  // Extract unique genres
  const genres = [
    "All",
    ...(Array.from(
      new Set(movies.map((m) => m.genre).filter(Boolean))
    ) as string[]),
  ];

  // Filtering logic
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" || movie.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <>
      <section className="p-8">
        {/* Search Input */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search Input */}
          <input
            id="movie-search"
            type="text"
            placeholder="Search movies..."
            className="w-full md:w-1/3 p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Genre Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`
        px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200
        ${
          selectedGenre === genre
            ? "bg-custom-red text-white border-custom-red"
            : "bg-white text-gray-700 border-gray-300"
        }
        focus:outline-none focus:ring-0
        active:bg-custom-red active:text-white
      `}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        {/* Movies Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <li
              key={movie.id}
              className="p-4 bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer flex flex-col"
              onClick={() => navigate(`/book/${movie.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") navigate(`/book/${movie.id}`);
              }}
              aria-label={`Book tickets for ${movie.title}, rating ${movie.rating} out of 10, duration ${movie.durationMin} minutes`}
            >
              <figure className="w-full h-48 mb-2 overflow-hidden rounded-lg">
                <img
                  src={
                    movie.posterUrl
                      ? `http://localhost:4000${movie.posterUrl}`
                      : "http://localhost:4000/uploads/Not_Found.JPG"
                  }
                  alt={`Poster of ${movie.title}`}
                  className="w-full h-full object-cover"
                />
              </figure>

              <h2 className="text-xl font-semibold">{movie.title}</h2>

              <p className="flex items-center gap-1">
                <StarIcon sx={{ color: "gold", mr: 0.5, fontSize: 30 }} />
                <span>Rating: {movie.rating}/10</span>
              </p>

              <p className="text-gray-600">
                Duration: {movie.durationMin} mins
              </p>
              <p className="text-gray-600">Genre: {movie.genre}</p>
            </li>
          ))}

          {filteredMovies.length === 0 && (
            <li className="col-span-full text-center text-gray-500">
              No movies found.
            </li>
          )}
        </ul>
      </section>
    </>
  );
}
