import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";

interface Theater {
  id: number;
  name: string;
  location: string;
}

interface Screening {
  id: number;
  theaterId: number;
  movieId: number;
  startTime: string;
}

interface Seat {
  id: number;
  seatNumber: string;
  isBooked: boolean;
}

interface Movie {
  id: number;
  title: string;
  posterUrl?: string | null;
}

export default function TimesPage() {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [seatsMap, setSeatsMap] = useState<Record<number, number>>({}); // screeningId -> seatsLeft

  const navigate = useNavigate();

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/movies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundMovie = res.data.find((m: any) => m.id === Number(movieId));
        setMovie(foundMovie);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, [movieId]);

  // Fetch theaters
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/theaters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTheaters(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTheaters();
  }, []);

  // Fetch screenings for selected theater + movie
  useEffect(() => {
    const fetchScreenings = async () => {
      if (!selectedTheater) return;
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(
          `/theaters/${selectedTheater}/screenings?movieId=${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setScreenings(res.data);

        // For each screening, fetch seats and count unbooked
        const seatsCounts: Record<number, number> = {};
        await Promise.all(
          res.data.map(async (screening: Screening) => {
            const seatsRes = await api.get(
              `/screenings/${screening.id}/seats`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const seats: Seat[] = seatsRes.data;
            const seatsLeft = seats.filter((s) => !s.isBooked).length;
            seatsCounts[screening.id] = seatsLeft;
          })
        );
        setSeatsMap(seatsCounts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScreenings();
  }, [selectedTheater, movieId]);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredScreenings = screenings.filter((s) => {
    const screeningDate = new Date(s.startTime).toISOString().split("T")[0];
    return screeningDate === selectedDate;
  });

  return (
    <section className="p-8">
      {movie && (
        <header className="mb-6 flex items-center gap-4">
          <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={
                movie.posterUrl
                  ? `http://localhost:4000${movie.posterUrl}`
                  : "http://localhost:4000/uploads/Not_Found.JPG"
              }
              alt={`Poster of ${movie.title}`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{movie.title}</h1>
        </header>
      )}

      <form className="mb-4" aria-label="Screening selection form">
        {/* Theater Selector */}
        <div className="mb-4">
          <label htmlFor="theater-select" className="block mb-2 font-medium">
            Theater
          </label>
          <select
            id="theater-select"
            className="w-full p-2 border rounded"
            value={selectedTheater ?? ""}
            onChange={(e) => setSelectedTheater(Number(e.target.value))}
          >
            <option value="">Select a theater</option>
            {theaters.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} - {t.location}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label htmlFor="date-select" className="block mb-2 font-medium">
            Date
          </label>
          <input
            id="date-select"
            type="date"
            className="w-full p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </form>

      {/* Available Slots */}
      <section aria-label="Available screening times">
        <h2 className="text-xl font-semibold mb-2">Available Times</h2>
        <ul>
          {filteredScreenings.map((s) => {
            const seatsLeft = seatsMap[s.id] ?? 0;
            const totalSeats = 6; // replace with actual total seats per screening if dynamic
            const bookedPercentage =
              ((totalSeats - seatsLeft) / totalSeats) * 100;

            let seatsColor = "text-green-600";
            if (bookedPercentage >= 70) seatsColor = "text-red-600";
            else if (bookedPercentage >= 40) seatsColor = "text-yellow-600";

            return (
              <li
                key={s.id}
                className="p-2 mb-2 rounded bg-gray-100 cursor-pointer hover:bg-blue-200 flex justify-between items-center"
                onClick={() => navigate(`/seats/${s.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") navigate(`/seats/${s.id}`);
                }}
                aria-label={`Screening at ${formatTime(
                  s.startTime
                )}, ${seatsLeft} seats left`}
              >
                <span>{formatTime(s.startTime)}</span>
                <span className={`text-sm font-semibold ${seatsColor}`}>
                  {seatsLeft} seats left
                </span>
              </li>
            );
          })}
          {filteredScreenings.length === 0 && (
            <p className="text-gray-500">
              No screenings available for this date.
            </p>
          )}
        </ul>
      </section>
    </section>
  );
}
