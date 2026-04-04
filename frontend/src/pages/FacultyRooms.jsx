import { FaUniversity, FaPlus, FaTimesCircle } from "react-icons/fa";
import "../styles/Faculty.css";
import { useState, useEffect } from "react";
import api from "../axiosInstance"
import { toast } from "react-toastify";

function FacultyRooms() {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    status: "Available"
  });

  // Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/rooms", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };
    fetchRooms();
  }, []);

  // Save new room
  const handleSaveRoom = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.post(
        "/api/rooms",
        roomForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Room created successfully!");
      setShowForm(false);
      setRoomForm({ name: "", capacity: "", status: "Available" });

      // Refresh room list
      const res = await api.get("/api/rooms", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to create room", err);
      toast.error("Error creating room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-page">
      <div className="faculty-card">
        <h2><FaUniversity /> Hall Management</h2>
        <button onClick={() => setShowForm(true)}>
          <FaPlus /> Create New Room
        </button>

        <table className="faculty-table">
          <thead>
            <tr>
              <th>Hall</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>{room.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <FaTimesCircle />
            </button>
            <h3>Create New Room</h3>

            <label>Hall Name</label>
            <input
              type="text"
              value={roomForm.name}
              onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
            />

            <label>Capacity</label>
            <input
              type="number"
              value={roomForm.capacity}
              onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
            />

            <label>Status</label>
            <select
              value={roomForm.status}
              onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
            </select>

            <div className="form-actions">
              <button onClick={handleSaveRoom} disabled={loading}>
                {loading ? "Saving..." : "Save Room"}
              </button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyRooms;
