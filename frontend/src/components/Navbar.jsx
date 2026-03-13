import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Layout.css";
import { toast } from "react-toastify"
import { FaBell , FaUserGraduate } from 'react-icons/fa';

const Navbar = () => {
     const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
    // 🔔 Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
        toast.info("Notifications loaded");
      } catch (err) {
        console.error("Failed to load notifications", err);
        toast.error("Failed to load notifications " + (err.response?.data?.message || ""));
      }
    };
    fetchNotifications();
  }, []);
  return (
    <div className='layout'>
      {/* 🔝 Header */}
      <header className="header">
        <h1>Exam Management System</h1>
        <div className="header-icons">
          <div className="notification-wrapper">
            <FaBell
              className="icon"
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map(note => (
                    <div key={note.id} className="notification-item">
                      {note.text}
                    </div>
                  ))
                ) : (
                  <div className="notification-item">No notifications</div>
                )}
              </div>
            )}
          </div>
          <FaUserGraduate className="icon" title="Profile" />
        </div>
      </header>
    </div>
  )
}

export default Navbar
