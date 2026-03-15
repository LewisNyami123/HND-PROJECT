import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

function FacultyStudent() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faculty/students", { headers });
        setStudents(res.data);
      } catch (err) {
        console.error("Error loading students", err);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="dashboard">
      <h2>Students</h2>
      {students.length ? (
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Department</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No students found</p>}
    </div>
  );
}

export default FacultyStudent;
