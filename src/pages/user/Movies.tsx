import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  durationMin: number;
  rating: number;
  posterUrl?: string | null;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:4000/movies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mappedMovies: Movie[] = res.data.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          durationMin: movie.durationMin,
          rating: movie.rating ?? 0,
          posterUrl: movie.posterUrl,
        }));
        setMovies(mappedMovies);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <input
        type="text"
        placeholder="Search movies..."
        className="w-full p-2 mb-6 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="p-4 bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer flex flex-col"
            onClick={() => navigate(`/book/${movie.id}`)}
          >
            <div className="w-full h-48 mb-2 overflow-hidden rounded-lg">
              <img
                src={
                  movie.posterUrl
                    ? `http://localhost:4000${movie.posterUrl}`
                    : "http://localhost:4000/uploads/Not_Found.JPG"
                }
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            <p className="text-yellow-600 font-semibold">
              ⭐ Rating: {movie.rating}/10
            </p>
            <p className="text-gray-600">Duration: {movie.durationMin} mins</p>
          </div>
        ))}
        {filteredMovies.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No movies found.
          </p>
        )}
      </div>
    </div>
  );
}
