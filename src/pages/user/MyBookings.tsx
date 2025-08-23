import { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
  id: number;
  seat: {
    seatNumber: string;
    id: number;
  };
  screening: {
    id: number;
    startTime: string;
    movie: { title: string; posterUrl?: string | null };
    theater: { name: string; location: string };
  };
}

interface GroupedBooking {
  screeningId: number;
  movieTitle: string;
  theaterName: string;
  screeningTime: string;
  posterUrl?: string | null;
  seats: string[];
  seatIds: number[]; // 👈 add this
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<GroupedBooking[]>([]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Group by screening
      const grouped: Record<number, GroupedBooking> = {};
      res.data.forEach((b: Booking) => {
        if (!grouped[b.screening.id]) {
          grouped[b.screening.id] = {
            screeningId: b.screening.id,
            movieTitle: b.screening.movie.title,
            theaterName: b.screening.theater.name,
            screeningTime: b.screening.startTime,
            posterUrl: b.screening.movie.posterUrl,
            seats: [],
            seatIds: [],
          };
        }
        grouped[b.screening.id].seats.push(b.seat.seatNumber);
        grouped[b.screening.id].seatIds.push(b.seat.id);
      });

      setBookings(Object.values(grouped));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (screeningId: number, seats: number[]) => {
    try {
      const token = localStorage.getItem("token");

      // You’ll need seat IDs, not just seat numbers
      await axios.delete(`http://localhost:4000/bookings/${screeningId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { seatIds: seats }, // 👈 pass seat IDs
      });

      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">You have no bookings yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bookings.map((b) => {
          const showTime = new Date(b.screeningTime);
          const now = new Date();
          const diffHours =
            (showTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          const canCancel = diffHours >= 48;

          return (
            <div
              key={b.screeningId}
              className="p-4 border rounded shadow flex flex-col gap-2"
            >
              {b.posterUrl && (
                <div className="w-full h-48 mb-2 overflow-hidden rounded-lg">
                  <img
                    src={`http://localhost:4000${b.posterUrl}`}
                    alt={b.movieTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold">{b.movieTitle}</h2>
              <p>🏛 Theater: {b.theaterName}</p>
              <p>🕒 Time: {showTime.toLocaleString()}</p>
              <p>💺 Seats: {b.seats.join(", ")}</p>

              <p className="text-sm text-gray-600 mt-2">
                ⚠️ Cancellation allowed only up to{" "}
                <strong>48 hours before showtime</strong>.
              </p>

              <button
                className={`mt-2 px-4 py-2 rounded ${
                  canCancel
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                disabled={!canCancel}
                onClick={() => handleCancel(b.screeningId, b.seatIds)}
              >
                Cancel Booking
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
