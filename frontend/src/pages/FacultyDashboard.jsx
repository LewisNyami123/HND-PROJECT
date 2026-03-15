import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

function FacultyDashboard() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [examRes, resultRes] = await Promise.all([
          axios.get("http://localhost:5000/api/faculty/exams", { headers }),
          axios.get("http://localhost:5000/api/faculty/results", { headers }),
        ]);
        setExams(examRes.data);
        setResults(resultRes.data);
      } catch (err) {
        console.error("Error loading faculty dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Faculty Dashboard</h2>

      <section>
        <h3>Your Exams</h3>
        {exams.length ? (
          <ul>
            {exams.map(exam => (
              <li key={exam._id}>{exam.course} — {new Date(exam.date).toLocaleDateString()}</li>
            ))}
          </ul>
        ) : <p>No exams created</p>}
      </section>

      <section>
        <h3>Student Results</h3>
        {results.length ? (
          <table>
            <thead>
              <tr>
                <th>Student</th><th>Department</th><th>Course</th><th>Total</th><th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r._id}>
                  <td>{r.studentName}</td>
                  <td>{r.department}</td>
                  <td>{r.course}</td>
                  <td>{r.total}</td>
                  <td>{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No results yet</p>}
      </section>
    </div>
  );
}

export default FacultyDashboard;
