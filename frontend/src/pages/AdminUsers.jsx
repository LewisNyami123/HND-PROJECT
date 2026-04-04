import { useEffect, useState } from "react";
import api from "../axiosInstance"
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarAlt,
  FaTrash,
  FaCrown,
  FaChalkboardTeacher,
  FaGraduationCap,
} from "react-icons/fa";
import "../styles/Admin.css";
import { toast } from "react-toastify";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load users. Please refresh or log in again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const roles = ["student", "faculty", "admin"];
    const nextRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];
    const roleNames = {
      admin: "Admin",
      faculty: "Faculty",
      student: "Student",
    };

    if (!window.confirm(`Change role to ${roleNames[nextRole]}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/api/admin/users/${id}/role`,
        { role: nextRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((u) => (u._id === id ? { ...u, role: nextRole } : u))
      );
      toast.success(`Role updated to ${roleNames[nextRole]}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const getRoleIconAndColor = (role) => {
    switch (role) {
      case "admin":
        return { icon: <FaCrown />, color: "status-pass bg-purple-100 text-purple-800" };
      case "faculty":
        return { icon: <FaChalkboardTeacher />, color: "status-badge bg-orange-100 text-orange-800" };
      default:
        return { icon: <FaGraduationCap />, color: "status-badge bg-blue-100 text-blue-800" };
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card text-center py-12">
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-card text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-8">
          <FaUser className="text-blue-600" />
          Manage Users
        </h2>

        {users.length === 0 ? (
          <div className="empty-state">
            <FaUser />
            <p>No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>
                    <FaUser className="inline mr-2" />
                    User
                  </th>
                  <th>
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </th>
                  <th>
                    <FaUserTag className="inline mr-2" />
                    Role
                  </th>
                  <th>
                    <FaCalendarAlt className="inline mr-2" />
                    Joined
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const { icon, color } = getRoleIconAndColor(user.role);
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="student-info">
                          <div className="student-avatar">
                            <FaUser />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            {user.level && (
                              <p className="text-sm text-gray-500">{user.level}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-700">{user.email}</td>
                      <td>
                        <span className={`status-badge ${color}`}>
  {icon} {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "No Role"}</span>
                      </td>
                      <td className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleRoleChange(user._id, user.role)}
                          className="change-role"
                          title="Cycle role: Student → Faculty → Admin"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="delete-user"
                          title="Delete user"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;