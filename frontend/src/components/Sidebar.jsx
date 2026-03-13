import React from 'react'
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaBook, FaChartLine, FaClock, FaUserGraduate,
  FaPlus, FaUniversity, FaDatabase, FaUsers,
  FaChartPie, FaCalendarAlt
} from "react-icons/fa";
import "../styles/Layout.css";
const SideBar = ({role}) => {
  const location = useLocation();
 

  const isActive = (path) => location.pathname.startsWith(path);


  return (
    <div className="layout">

      {/* 📚 Sidebar */}
      <aside className="sidebar">
        <h2>Navigation</h2>
        {role === "student" && (
          <>
            <Link to="/exams" className={isActive("/exams") ? "active" : ""}><FaBook /> Exams</Link>
            <Link to="/results" className={isActive("/results") ? "active" : ""}><FaChartLine /> Results</Link>
            <Link to="/countdown" className={isActive("/countdown") ? "active" : ""}><FaClock /> Countdown</Link>
            <Link to="/profile" className={isActive("/profile") ? "active" : ""}><FaUserGraduate /> Profile</Link>
          </>
        )}
        {/* Faculty + Admin routes unchanged */}
        {role === "falculty" && ( 
          <> <Link to="/falculty/create" className={isActive("/falculty/create") ? "active" : ""}><FaPlus /> Create Exam</Link> 
          <Link to="/falculty/rooms" className={isActive("/falculty/rooms") ? "active" : ""}><FaUniversity /> Rooms</Link> 
          <Link to="/falculty/questions" className={isActive("/falculty/questions") ? "active" : ""}><FaDatabase /> Question Bank</Link> 
          <Link to="/falculty/schedule" className={isActive("/falculty/schedule") ? "active" : ""}><FaCalendarAlt /> Schedule Exam</Link> </> )}
         
         
         {role === "admin" && ( 
          <> <Link to="/admin/users" className={isActive("/admin/users") ? "active" : ""}><FaUsers /> Users</Link> 
          <Link to="/admin/analytics" className={isActive("/admin/analytics") ? "active" : ""}><FaChartPie /> Analytics</Link> 
          </> )}
      </aside>

      {/* 📄 Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default SideBar
