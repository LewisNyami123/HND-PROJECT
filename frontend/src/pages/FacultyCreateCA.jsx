import { FaPlus, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Faculty.css";

function FacultyCreateCA() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [caForm, setCaForm] = useState({
    title: "",
    course: "",
    date: "",
    score: "",
    maxScore: "",
    student: "",
    semester: ""
  });

  // Fetch students for dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/faculty/students", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };
    fetchStudents();
  }, []);

    const handleSaveCA = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/faculty/ca",
        caForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("CA created successfully!");
      setShowForm(false);
      setCaForm({ title: "", course: "", date: "", score: "", maxScore: "", student: "", semester: "" });
    } catch (err) {
      console.error("Failed to create CA", err);
      toast.error("Error creating CA");
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="faculty-page">
      <div className="faculty-card">
        <h2><FaPlus /> Create Continuous Assessment</h2>
        <button onClick={() => setShowForm(true)}>Create New CA</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <FaTimesCircle />
            </button>
            <h3>Create New CA</h3>

            <label>Title</label>
            <input
              type="text"
              value={caForm.title}
              onChange={(e) => setCaForm({ ...caForm, title: e.target.value })}
            />

            <label>Course</label>
            <input
              type="text"
              value={caForm.course}
              onChange={(e) => setCaForm({ ...caForm, course: e.target.value })}
            />

            <label>Date</label>
            <input
              type="date"
              value={caForm.date}
              onChange={(e) => setCaForm({ ...caForm, date: e.target.value })}
            />

            <label>Score</label>
            <input
              type="number"
              value={caForm.score}
              onChange={(e) => setCaForm({ ...caForm, score: e.target.value })}
            />

            <label>Max Score</label>
            <input
              type="number"
              value={caForm.maxScore}
              onChange={(e) => setCaForm({ ...caForm, maxScore: e.target.value })}
            />

            <label>Student</label>
            <select
              value={caForm.student}
              onChange={(e) => setCaForm({ ...caForm, student: e.target.value })}
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>

            <label>Semester</label>
            <select
              value={caForm.semester}
              onChange={(e) => setCaForm({ ...caForm, semester: e.target.value })}
            >
              <option value="">Select Semester</option>
              <option value="Semester 1 2025/2026">Semester 1 2025/2026</option>
              <option value="Semester 2 2025/2026">Semester 2 2025/2026</option>
            </select>

            <div className="form-actions">
              <button onClick={handleSaveCA} disabled={loading}>
                {loading ? "Saving..." : "Save CA"}
              </button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyCreateCA;