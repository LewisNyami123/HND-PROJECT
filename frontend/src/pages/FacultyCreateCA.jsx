import { FaPlus, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Faculty.css";

function FacultyCreateCA() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [caForm, setCaForm] = useState({
    examId: "",
    studentId: "",
    caScore: "",
    credits: ""
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

    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/faculty/my-exams", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExams(res.data);
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
    };

    fetchStudents();
    fetchExams();
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
      toast.success("CA submitted successfully!");
      setShowForm(false);
      setCaForm({ examId: "", studentId: "", caScore: "", credits: "" });
    } catch (err) {
      console.error("Failed to submit CA", err);
      toast.error("Error submitting CA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-page">
      <div className="faculty-card">
        <h2><FaPlus /> Submit Continuous Assessment</h2>
        <button onClick={() => setShowForm(true)}>New CA Entry</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <FaTimesCircle />
            </button>
            <h3>Submit CA Marks</h3>

            <label>Exam</label>
            <select
              value={caForm.examId}
              onChange={(e) => setCaForm({ ...caForm, examId: e.target.value })}
            >
              <option value="">Select Exam</option>
              {exams.map(exam => (
                <option key={exam._id} value={exam._id}>
                  {exam.title} ({exam.course})
                </option>
              ))}
            </select>

            <label>Student</label>
            <select
              value={caForm.studentId}
              onChange={(e) => setCaForm({ ...caForm, studentId: e.target.value })}
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>

            <label>CA Score</label>
            <input
              type="number"
              value={caForm.caScore}
              onChange={(e) => setCaForm({ ...caForm, caScore: e.target.value })}
            />

            <label>Credits</label>
            <input
              type="number"
              value={caForm.credits}
              onChange={(e) => setCaForm({ ...caForm, credits: e.target.value })}
            />

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
