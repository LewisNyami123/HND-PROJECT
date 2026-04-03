import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

function FacultyResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faculty/results", { headers });
        setResults(res.data);
      } catch (err) {
        console.error("Error loading results", err);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="dashboard">
      <h2>Results</h2>
      {results.length ? (
        <table>
          <thead>
            <tr>
              <th>Student</th><th>Department</th><th>Course</th><th>CA (30)</th><th>Exam (70)</th><th>Total</th><th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r._id}>
                <td>{r.student?.name}</td>
                <td>{r.student?.department}</td>
                <td>{r.exam?.course}</td>
                <td>{r.caScore}</td>
                <td>{r.examScore}</td>
                <td>{r.total}</td>
                <td>{r.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No results yet</p>}
    </div>
  );
}

export default FacultyResults;
