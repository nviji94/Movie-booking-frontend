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
  // Add Theater
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

  // Update Theater
  const handleUpdateTheater = async (theater: Theater) => {
    if (!token) return;
    const name = prompt("New theater name?", theater.name);
    const location = prompt("New location?", theater.location);
    if (!name || !location) return;

    try {
      const res = await axios.put(
        `http://localhost:4000/theaters/${theater.id}`,
        { name, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update state
      setTheaters(theaters.map((t) => (t.id === theater.id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert("Failed to update theater");
    }
  };

  // Delete Theater
  const handleDeleteTheater = async (theaterId: number) => {
    if (!token) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this theater?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/theaters/${theaterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from state
      setTheaters(theaters.filter((t) => t.id !== theaterId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete theater");
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

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleUpdateTheater(theater)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTheater(theater.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
