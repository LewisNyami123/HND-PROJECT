import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Faculty.css";
import {jwtDecode} from "jwt-decode";



function FacultyScheduleExam() {
  const [form, setForm] = useState({
    title: "",
    course: "",
    level: "",
    department: "",
    duration: "",
    scheduledTime: "",
    roomId: ""
  });

  const [rooms, setRooms] = useState([]);

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    // defer the state update
    setTimeout(() => {
      setForm(prev => ({ ...prev, faculty: decoded.id }));
    }, 0);
  }
}, []);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/rooms", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(res.data);
      } catch (err) {
        toast.error("Failed to load rooms" + (err.response?.data?.message || ""));
        console.error("Failed to load rooms", err);
      }
    };
    fetchRooms();
  }, []);
 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log('sending token',token)
      await axios.post("http://localhost:5000/api/exams/schedule", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Exam scheduled successfully!");
      setForm({
        title: "",
        course: "",
        level: "",
        department: "",
        duration: "",
        scheduledTime: "",
        roomId: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule exam");
    }
  };

  return (
    <div className="faculty-page">
      <div className="faculty-card">
        <h2>Schedule Exam</h2>
        <form className="faculty-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Exam Title" value={form.title} onChange={handleChange} />
          <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
          <input name="level" placeholder="Level (e.g. 200)" value={form.level} onChange={handleChange} />
          <select name="department" id="" value={form.department} onChange={handleChange}>
            <option value="">Select Department</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Laboratory Technician">Laboratory Technician</option>
              <option value="Electric Engineering">Electric Engineering</option>
              <option value="Midwife">Midwife</option>
              <option value="Nursing">Nursing</option>
              <option value="Public Health">Public Health</option>
              <option value="Agricultural Engineering">Agricultural Engineering</option>
          </select>
          <input type="number" name="duration" placeholder="Duration (minutes)" value={form.duration} onChange={handleChange} />
          <input type="datetime-local" name="scheduledTime" value={form.scheduledTime} onChange={handleChange} />

          {/* Room dropdown */}
          <select name="roomId" value={form.roomId} onChange={handleChange}>
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room._id} value={room._id}>
                {room.name} ({room.capacity})
              </option>
            ))}
          </select>

          <button type="submit">Schedule Exam</button>
        </form>
      </div>
    </div>
  );
}

export default FacultyScheduleExam;