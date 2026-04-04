import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosInstance"
import "../styles/Exams.css";
import Countdown from "./Countdown";
import { toast } from "react-toastify";
import { FaClock, FaPlayCircle, FaCheckCircle } from "react-icons/fa";

function Exams() {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/exams", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExams(res.data);
      } catch (err) {
        console.error("Failed to load exams", err);
        toast.error("Failed to load exams " + (err.response?.data?.message || ""));
      }
    };
    fetchExams();
  }, []);

  // Helpers
  const getStatus = (scheduledTime, duration) => {
    const start = new Date(scheduledTime);
    const end = new Date(start.getTime() + duration * 60000);
    const now = new Date();

    if (now < start) return "pending";
    if (now >= start && now <= end) return "ongoing";
    return "completed";
  };

  const canStartExam = (scheduledTime, duration) => {
    const start = new Date(scheduledTime);
    const end = new Date(start.getTime() + duration * 60000);
    const now = new Date();

    // Ongoing OR within 15-minute grace period before start
    return (now >= start && now <= end) ||
           (now < start && (start - now) <= 15 * 60 * 1000);
  };

  // Filtering
  const filteredExams = exams.filter(exam => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter || getStatus(exam.scheduledTime, exam.duration) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Summary counts
  const summary = {
    pending: exams.filter(e => getStatus(e.scheduledTime, e.duration) === "pending").length,
    ongoing: exams.filter(e => getStatus(e.scheduledTime, e.duration) === "ongoing").length,
    completed: exams.filter(e => getStatus(e.scheduledTime, e.duration) === "completed").length,
  };

  return (
    <>
      <div className="page-header"> 
        <h1>Student Exam Dashboard</h1> 
        <p>Track your upcoming exams, progress, and status at a glance.</p> 
      </div>

      {/* Search + Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Summary Dashboard */}
      <div className="summary-dashboard">
        <span className="badge pending">
          <FaClock /> Pending: {summary.pending}
        </span>
        <span className="badge ongoing">
          <FaPlayCircle /> Ongoing: {summary.ongoing}
        </span>
        <span className="badge completed">
          <FaCheckCircle /> Completed: {summary.completed}
        </span>
      </div>

      {/* Exam List */}
      <div className="student-page">
        <h2>Upcoming Exams</h2>
        <div className="exam-list">
          {filteredExams.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No exams match your filters.</p>
          ) : (
            filteredExams.map(exam => {
              const status = getStatus(exam.scheduledTime, exam.duration);
              const showStartButton = canStartExam(exam.scheduledTime, exam.duration);

              return (
                <div key={exam._id} className="exam-card">
                  <h3>{exam.title}</h3>
                  <p><strong>Course:</strong> {exam.course}</p>
                  <p><strong>Level:</strong> {exam.level}</p>
                  <p><strong>Duration:</strong> {exam.duration} minutes</p>
                  <p><strong>Scheduled:</strong> {new Date(exam.scheduledTime).toLocaleString()}</p>

                  <div className="countdown-wrapper">
                    <span>Countdown:</span>
                    <Countdown scheduledTime={exam.scheduledTime} />
                  </div>

                  <p>
                    <strong>Status:</strong>
                    <span className={`status-badge ${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </p>

                  {/* Action Button */}
                  <div className="exam-actions">
                    {showStartButton ? (
                      <button
                        className="start-exam-btn"
                        onClick={() => navigate(`/take/${exam._id}`)}
                      >
                        <FaPlayCircle className="mr-2" />
                        Start Exam Now
                      </button>
                    ) : status === "completed" ? (
                      <button
                        className="view-result-btn"
                        onClick={() => navigate(`/results`)}
                      >
                        View Result
                      </button>
                    ) : (
                      <button className="disabled-btn" disabled>
                        Not Started Yet
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Exams;
