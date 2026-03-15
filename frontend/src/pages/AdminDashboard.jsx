import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats", { headers }),
          axios.get("http://localhost:5000/api/admin/users", { headers }),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error loading admin dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>System Overview</h3>
        <p>Students: {stats.students}</p>
        <p>Faculty: {stats.faculty}</p>
        <p>Exams: {stats.exams}</p>
        <p>Departments: {stats.departments}</p>
      </section>

      <section>
        <h3>Recent Users</h3>
        {users.length ? (
          <ul>
            {users.map(u => (
              <li key={u._id}>{u.name} — {u.department} ({u.role})</li>
            ))}
          </ul>
        ) : <p>No users found</p>}
      </section>
    </div>
  );
}

export default AdminDashboard;
