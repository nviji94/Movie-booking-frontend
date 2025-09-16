import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import api from "../../api";

interface Seat {
  id: number;
  seatNumber: string;
  isBooked: boolean;
}

export default function SeatsPage() {
  const { id: screeningId } = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  useEffect(() => {
    if (!screeningId) return;

    const socket: Socket = io("http://localhost:4000");

    socket.on(
      "seatsBooked",
      (data: { screeningId: number; seatIds: number[] }) => {
        if (Number(screeningId) === data.screeningId) {
          setSeats((prev) =>
            prev.map((seat) =>
              data.seatIds.includes(seat.id)
                ? { ...seat, isBooked: true }
                : seat
            )
          );
          setSelectedSeats((prev) =>
            prev.filter((id) => !data.seatIds.includes(id))
          );
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [screeningId]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!screeningId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(
          `/screenings/${screeningId}/seats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSeats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeats();
  }, [screeningId]);

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBookSeats = async () => {
    if (!screeningId || selectedSeats.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/screenings/${screeningId}/book`,
        { seatIds: selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedSeats([]);
      alert("Seats booked successfully!");
    } catch (err) {
      console.error(err);
      alert("Booking failed.");
    }
  };

  // Sort seats alphabetically and group by row
  const seatsByRow = seats
    .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
    .reduce((acc: Record<string, Seat[]>, seat) => {
      const row = seat.seatNumber.charAt(0);
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {});

  return (
    <section className="p-8">
      <header>
        <h1 className="text-3xl font-bold mb-6">Select Seats</h1>
      </header>

      {/* Screen indicator */}
      <div
        className="mb-4 w-full h-4 bg-gray-300 rounded text-center relative"
        role="region"
        aria-label="Screen"
      >
        <span className="absolute left-1/2 transform -translate-x-1/2 -top-6 text-gray-700 font-semibold">
          SCREEN
        </span>
      </div>

      <main>
        <ul className="space-y-2">
          {Object.keys(seatsByRow).map((row) => (
            <li key={row}>
              <div
                className="flex justify-center gap-2"
                role="group"
                aria-label={`Row ${row}`}
              >
                {seatsByRow[row].map((seat) => (
                  <button
                    key={seat.id}
                    disabled={seat.isBooked}
                    onClick={() => toggleSeat(seat.id)}
                    className={`p-3 border rounded text-center ${
                      seat.isBooked
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : selectedSeats.includes(seat.id)
                        ? "bg-green-500 text-white"
                        : "bg-white hover:bg-green-200"
                    }`}
                    aria-pressed={selectedSeats.includes(seat.id)}
                    aria-label={`Seat ${seat.seatNumber}${
                      seat.isBooked ? ", booked" : ""
                    }`}
                  >
                    {seat.seatNumber}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleBookSeats}
          aria-label="Book selected seats"
        >
          Book Selected Seats
        </button>
      </main>
    </section>
  );
}
