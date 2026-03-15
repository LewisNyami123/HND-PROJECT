import { useEffect, useState } from "react";
import axios from "axios";
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
          axios.get("http://localhost:5000/api/student/exams", { headers }),
          axios.get("http://localhost:5000/api/student/results", { headers }),
          axios.get("http://localhost:5000/api/notifications", { headers }),
        ]);
        setExams(examRes.data);
        setResults(resultRes.data);
        setNotifications(notifRes.data);
      } catch (err) {
        console.error("Error loading student dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>

      <section>
        <h3>Upcoming Exams</h3>
        {exams.length ? (
          <ul>
            {exams.map(exam => (
              <li key={exam._id}>
                {exam.course} — {new Date(exam.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : <p>No upcoming exams</p>}
      </section>

      <section>
        <h3>Results</h3>
        {results.length ? (
          <table>
            <thead>
              <tr>
                <th>Course</th><th>CA (30)</th><th>Exam (70)</th><th>Total</th><th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r._id}>
                  <td>{r.course}</td>
                  <td>{r.caScore}</td>
                  <td>{r.examScore}</td>
                  <td>{r.total}</td>
                  <td>{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No results yet</p>}
      </section>

      <section>
        <h3>Notifications</h3>
        {notifications.length ? (
          <ul>
            {notifications.map(n => <li key={n._id}>{n.text}</li>)}
          </ul>
        ) : <p>No notifications</p>}
      </section>
    </div>
  );
}

export default StudentDashboard;
