import { useState, useEffect } from "react";
import api from "../axiosInstance"
import "../styles/Dashboard.css";

function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [examRes, resultRes, notifRes] = await Promise.all([
          api.get("/api/exams", { headers }),
          api.get("/api/results", { headers }),
          api.get("/api/notifications", { headers }),
        ]);

        setExams(examRes.data);
        setResults(Array.isArray(resultRes.data) ? resultRes.data : resultRes.data.results);
        setNotifications(notifRes.data);
      } catch (err) {
        console.error("Error loading student dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Student Dashboard</h2>

      {/* Exams Card */}
      <div className="card">
        <h3>Upcoming Exams</h3>
        {exams.length ? (
          <ul className="card-list">
            {exams.map((exam) => (
              <li key={exam._id} className="card-item">
                <strong>{exam.title}</strong> — {exam.course} <br />
                <span className="date">
                  {exam.scheduledTime
                    ? new Date(exam.scheduledTime).toLocaleString()
                    : "No date set"}
                </span>
              </li>
            ))}
          </ul>
        ) : <p>No upcoming exams</p>}
      </div>

      {/* Results Card */}
      <div className="card">
        <h3>Results</h3>
        {results.length ? (
          <div className="results-grid">
            {results.map(r => (
              <div key={r._id} className="result-card">
                <h4>{r.exam?.title || r.course}</h4>
                <p>CA: {r.caScore} / 30</p>
                <p>Exam: {r.examScore} / 70</p>
                <p>Total: {r.total}</p>
                <p className={`grade grade-${r.grade}`}>Grade: {r.grade}</p>
              </div>
            ))}
          </div>
        ) : <p>No results yet</p>}
      </div>

      {/* Notifications Card */}
      <div className="card">
        <h3>Notifications</h3>
        {notifications.length ? (
          <ul className="card-list">
            {notifications.map(n => (
              <li key={n._id} className="card-item">{n.text}</li>
            ))}
          </ul>
        ) : <p>No notifications</p>}
      </div>
    </div>
  );
}

export default StudentDashboard;
