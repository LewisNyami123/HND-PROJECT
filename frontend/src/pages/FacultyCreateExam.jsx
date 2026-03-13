import { FaPlus, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Faculty.css";

function FacultyCreateExam() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]); // added exams state
  const [examForm, setExamForm] = useState({
    title: "",
    course: "",
    date: "",
    duration: 60,
    questions: [],
    scheduledTime: "",
    level: ""
  });
  const [editingExam, setEditingExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


// Fetch exams when component mounts
useEffect(() => {
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/faculty/exams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExams(res.data); // populate exams list
    } catch (err) {
      console.error("Failed to fetch exams", err);
      toast.error("Error fetching exams");
    }
  };
  fetchExams();
}, []);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/faculty/questions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      }
    };
    fetchQuestions();
  }, []);

  // Save exam
  const handleSaveExam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/faculty/exams",
        examForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Exam created successfully!");
      setExams(prev => [...prev, res.data]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Failed to create exam", err);
      toast.error("Error creating exam");
    } finally {
      setLoading(false);
    }
  };

  // Update exam
  const handleUpdateExam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/faculty/exams/${editingExam._id}`,
        examForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExams(prev =>
        prev.map(e => (e._id === editingExam._id ? res.data : e))
      );

      toast.success("Exam updated successfully!");
      setShowForm(false);
      setIsEditing(false);
      setEditingExam(null);
      resetForm();
    } catch (err) {
      console.error("Failed to update exam", err);
      toast.error("Error updating exam");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setExamForm({
      title: "",
      course: "",
      date: "",
      duration: 60,
      questions: [],
      scheduledTime: "",
      level: ""
    });
  };
  //delete
  const handleDeleteExam = async (examId) => {
  if (!window.confirm("Are you sure you want to delete this exam?")) return;
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/api/faculty/exams/${examId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setExams(prev => prev.filter(e => e._id !== examId));
    toast.success("Exam deleted successfully!");
  } catch (err) {
    console.error("Failed to delete exam", err);
    toast.error("Error deleting exam");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="faculty-page">
      <div className="faculty-card">
        <h2><FaPlus /> Create Exam</h2>
        <button onClick={() => setShowForm(true)}>Create New Exam</button>
      </div>

      {/* Exam list */}
      <div className="exam-list">
        {exams.map(exam => (
          <div key={exam._id} className="exam-item">
            <h4>{exam.title} ({exam.course})</h4>
            <p>Level: {exam.level} | Duration: {exam.duration} mins</p>
            <button
              className="edit-btn"
              onClick={() => {
                setEditingExam(exam);
                setExamForm({
                  title: exam.title,
                  course: exam.course,
                  date: exam.date?.slice(0, 10),
                  duration: exam.duration,
                  questions: exam.questions.map(q => q._id),
                  scheduledTime: exam.scheduledTime?.slice(0, 16),
                  level: exam.level
                });
                setIsEditing(true);
                setShowForm(true);
              }}
            >
              Edit
            </button>
                  <button
              className="delete-btn"
              onClick={() => handleDeleteExam(exam._id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <FaTimesCircle />
            </button>
            <h3>{isEditing ? "Edit Exam" : "Create New Exam"}</h3>

            <label>Title</label>
            <input
              type="text"
              value={examForm.title}
              onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
            />

            <label>Course</label>
            <input
              type="text"
              value={examForm.course}
              onChange={(e) => setExamForm({ ...examForm, course: e.target.value })}
            />

            <label>Date</label>
            <input
              type="date"
              value={examForm.date}
              onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
            />

            <label>Scheduled Time</label>
            <input
              type="datetime-local"
              value={examForm.scheduledTime}
              onChange={(e) => setExamForm({ ...examForm, scheduledTime: e.target.value })}
            />

            <label>Level</label>
            <select
              value={examForm.level}
              onChange={(e) => setExamForm({ ...examForm, level: e.target.value })}
            >
              <option value="">Select Level</option>
              <option value="Level 100">Level 100</option>
              <option value="Level 200">Level 200</option>
              <option value="Level 300">Level 300</option>
              <option value="Level 400">Level 400</option>
            </select>

            <label>Duration (minutes)</label>
            <input
              type="number"
              value={examForm.duration}
              onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })}
            />

            <label>Select Questions</label>
            <div className="question-selector">
              {questions.map((q) => (
                <div key={q._id} className="question-item">
                  <input
                    type="checkbox"
                    checked={examForm.questions.includes(q._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setExamForm(prev => ({ ...prev, questions: [...prev.questions, q._id] }));
                      } else {
                        setExamForm(prev => ({ ...prev, questions: prev.questions.filter(id => id !== q._id) }));
                      }
                    }}
                  />
                  <span>{q.text} ({q.course}, {q.type})</span>
                </div>
              ))}
            </div>

            <div className="form-actions">
              {isEditing ? (
                <button onClick={handleUpdateExam} disabled={loading}>
                  {loading ? "Updating..." : "Update Exam"}
                </button>
              ) : (
                <button onClick={handleSaveExam} disabled={loading}>
                  {loading ? "Saving..." : "Save Exam"}
                </button>
              )}
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyCreateExam;