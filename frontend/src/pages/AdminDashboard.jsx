import { useEffect, useState } from "react";
import api from "../axiosInstance"
import "../styles/Dashboard.css";
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/api/admin/stats", { headers }),   // ✅ totals
          api.get("/api/admin/users", { headers }),   // ✅ all users
        ]);
        setStats(statsRes.data);   // object with students, faculty, exams, departments
        setUsers(usersRes.data);   // array of users
        setLoading(false);
      } catch (err) {
        console.error("Error loading admin dashboard", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-12">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* System Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaUsers className="stat-icon students" />
          <h3>Students</h3>
          <p>{stats.students || 0}</p>
        </div>
        <div className="stat-card">
          <FaUserTie className="stat-icon faculty" />
          <h3>Faculty</h3>
          <p>{stats.faculty || 0}</p>
        </div>
        <div className="stat-card">
          <FaClipboardList className="stat-icon exams" />
          <h3>Exams</h3>
          <p>{stats.exams || 0}</p>
        </div>
        <div className="stat-card">
          <FaBuilding className="stat-icon departments" />
          <h3>Departments</h3>
          <p>{stats.departments || 0}</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <h3>Recent Users</h3>
        {users.length ? (
          <div className="overflow-x-auto">
            <table className="users-table">
              <thead>
                <tr>
                  <th><FaUser className="inline mr-2" /> Name</th>
                  <th><FaEnvelope className="inline mr-2" /> Email</th>
                  <th><FaUserTag className="inline mr-2" /> Role</th>
                  <th><FaCalendarAlt className="inline mr-2" /> Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-2">
              Showing {Math.min(users.length, 5)} of {users.length} users
            </p>
          </div>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
