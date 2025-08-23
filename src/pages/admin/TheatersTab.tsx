import { Theater } from "./AdminDashboard";
import axios from "axios";

interface TheatersTabProps {
  theaters: Theater[];
  setTheaters: (theaters: Theater[]) => void;
  token: string | null;
}

export default function TheatersTab({
  theaters,
  setTheaters,
  token,
}: TheatersTabProps) {
  const handleAddTheater = async () => {
    const name = prompt("Theater name?");
    const location = prompt("Location?");
    if (!name || !location || !token) return;

    try {
      const res = await axios.post(
        "http://localhost:4000/theaters",
        { name, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTheaters([...theaters, res.data]);
    } catch (err) {
      console.error(err);
      alert("Failed to add theater");
    }
  };

  return (
    <div>
      <button
        onClick={handleAddTheater}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Theater
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {theaters.map((theater) => (
          <div key={theater.id} className="p-4 border rounded shadow">
            <h3 className="font-semibold">{theater.name}</h3>
            <p>{theater.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
