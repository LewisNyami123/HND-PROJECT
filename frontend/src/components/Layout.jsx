import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaChartLine,
  FaClock,
  FaUserGraduate,
  FaPlus,
  FaUniversity,
  FaDatabase,
  FaUsers,
  FaChartPie,
  FaCalendarAlt,
  FaBell,
  FaChartBar,
  FaArrowAltCircleRight,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHome
} from "react-icons/fa";

import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Layout.css";
import { toast } from "react-toastify";
import logo from "../assets/LOGO DYHIP.jpg";

function Layout({ role }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const isActive = (path) => location.pathname.startsWith(path);

  // 🔔 Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setNotifications(res.data);

      } catch (err) {

        console.error("Failed to load notifications", err);

      }

    };

    fetchNotifications();

  }, []);

  // 🔓 Logout
  const handleLogout = () => {

    localStorage.clear();

    toast.success("Logged out successfully");

    navigate("/login");

  };

  return (

    <div className="layout">

      {/* HEADER */}

      <header className="header">

        <div className="header-left">

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className="header-brand">
            <img src={logo} alt="Logo" />
            <h2>EMS</h2>
          </div>

        </div>

        <div className="header-right">
         {/* STUDENT */}
   
    {/* FACULTY */}
    {role === "faculty" && (
      <>
        <Link to="/faculty/submitca" className={isActive("/faculty/submitca") ? "nav-link active" : "nav-link"}>
          <FaPlus />
          <span>Submit CA</span>
        </Link>

        {/* Profile added */}
        {/* <Link to="/faculty/profile" className={isActive("/profile") ? "nav-link active" : "nav-link"}>
          <FaUserGraduate />
          <span>Profile</span>
        </Link> */}
      </>
    )}

   
          {/* Notifications */}

          <div className="notification-wrapper">

            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />

              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}

            </button>

            {showNotifications && (

              <div className="notification-dropdown">

                <div className="notification-header">
                  Notifications
                </div>

                {notifications.length > 0 ? (

                  <div className="notification-list">

                    {notifications.map(note => (

                      <div key={note._id} className="notification-item">
                        {note.text}
                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="notification-empty">
                    No notifications
                  </div>

                )}

              </div>

            )}

          </div>

          {/* Profile */}

          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <FaUserGraduate />
          </button>

          {showProfileMenu && (

            <div className="profile-dropdown">

              <Link to="/profile" className="profile-menu-item">
                <FaUserGraduate />
                <span>Profile</span>
              </Link>

              <button
                className="profile-menu-item logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>

            </div>

          )}

        </div>

      </header>

      {/* SIDEBAR */}

     <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
  <nav className="sidebar-nav">

    {/* STUDENT */}
    {role === "student" && (
      <>
        <Link to="/dashboard" className={isActive("/dashboard") ? "nav-link active" : "nav-link"}>
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link to="/exams" className={isActive("/exams") ? "nav-link active" : "nav-link"}>
          <FaBook />
          <span>Exams</span>
        </Link>

        <Link to="/results" className={isActive("/results") ? "nav-link active" : "nav-link"}>
          <FaChartLine />
          <span>Results</span>
        </Link>

        <Link to="/countdown" className={isActive("/countdown") ? "nav-link active" : "nav-link"}>
          <FaClock />
          <span>Countdown</span>
        </Link>

        {/* Profile added */}
        <Link to="/profile" className={isActive("/profile") ? "nav-link active" : "nav-link"}>
          <FaUserGraduate />
          <span>Profile</span>
        </Link>
      </>
    )}

    {/* FACULTY */}
    {role === "faculty" && (
      <>
        <Link to="/faculty/dashboard" className={isActive("/faculty/dashboard") ? "nav-link active" : "nav-link"}>
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link to="/faculty/create" className={isActive("/faculty/create") ? "nav-link active" : "nav-link"}>
          <FaPlus />
          <span>Create Exam</span>
        </Link>

        <Link to="/faculty/questions" className={isActive("/faculty/questions") ? "nav-link active" : "nav-link"}>
          <FaDatabase />
          <span>Question Bank</span>
        </Link>

        <Link to="/faculty/students" className={isActive("/faculty/students") ? "nav-link active" : "nav-link"}>
          <FaUsers />
          <span>Students</span>
        </Link>

        <Link to="/faculty/rooms" className={isActive("/faculty/rooms") ? "nav-link active" : "nav-link"}>
          <FaUniversity />
          <span>Rooms</span>
        </Link>

        <Link to="/faculty/schedule" className={isActive("/faculty/schedule") ? "nav-link active" : "nav-link"}>
          <FaCalendarAlt />
          <span>Schedule Exam</span>
        </Link>

        <Link to="/faculty/results" className={isActive("/faculty/results") ? "nav-link active" : "nav-link"}>
          <FaChartBar />
          <span>Results</span>
        </Link>

        {/* Profile added */}
        <Link to="/faculty/profile" className={isActive("/profile") ? "nav-link active" : "nav-link"}>
          <FaUserGraduate />
          <span>Profile</span>
        </Link>
      </>
    )}

    {/* ADMIN */}
    {role === "admin" && (
      <>
        <Link to="/admin/dashboard" className={isActive("/admin/dashboard") ? "nav-link active" : "nav-link"}>
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link to="/admin/users" className={isActive("/admin/users") ? "nav-link active" : "nav-link"}>
          <FaUsers />
          <span>Users</span>
        </Link>

        <Link to="/admin/results" className={isActive("/admin/results") ? "nav-link active" : "nav-link"}>
          <FaChartBar />
          <span>Results</span>
        </Link>

        <Link to="/admin/analytics" className={isActive("/admin/analytics") ? "nav-link active" : "nav-link"}>
          <FaChartPie />
          <span>Analytics</span>
        </Link>

        {/* Profile added */}
        <Link to="/admin/profile" className={isActive("/admin/profile") ? "nav-link active" : "nav-link"}>
          <FaUserGraduate />
          <span>Profile</span>
        </Link>
        <Link to="/admin/register" className={isActive("/admin/register") ? "nav-link active" : "nav-link"}>
          <FaUsers />
          <span>Register User</span>
        </Link>
      </>
    )}

  </nav>
</aside>


      {/* MAIN */}

      <main className="main-content">
        <Outlet />
      </main>

    </div>

  );

}

export default Layout;