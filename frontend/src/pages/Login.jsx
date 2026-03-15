import React from 'react'
import { useState } from 'react';
import axios from "axios"
import '../styles/Login.css'
import LOGO from '../assets/LOGO DYHIP.jpg';
import { toast } from "react-toastify";


import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email,setEmail]= useState("");
    const [password,setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    
    // this function will handle form submission
    const handleSubmit = async (e)=>{
      e.preventDefault();
      setLoading(true);
      try{
      const response = await axios.post('http://localhost:5000/api/auth/login',{
        email,
        password,
        
      });
       // Save auth info in localStorage
      localStorage.setItem('token',response.data.token);
      localStorage.setItem('role',response.data.user.role);
      localStorage.setItem("level", response.data.user.level);
      localStorage.setItem("department", response.data.user.department);

       // Show toast notification
        toast.success("Login successful!");
        // Redirect to dashboard
        const userRole = response.data.user.role.toLowerCase();

if (userRole === "student") {
  navigate("/exams");
} else if (userRole === "falculty") {
  navigate("/falculty/create");
} else {
  navigate("/admin/users");
}

            // 🔑 Force App.jsx to re-check token immediately
             window.location.reload();
      // this portion will navigate to dashboard after login
      }catch(err){
        toast.error('Login failed:' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  return (
   <>
   <div className="login-page">
    <div className="login-container">
      <div className="login-left">
         <div className="logo-wrapper">
           <img src={LOGO} alt="DYHIP Logo" className="logo-image"/>
         </div>
        <h1>DYHIP</h1>
       <p>Welcome to Divine Yard! Please login to your account.</p>
      </div>
       
      <div className="login-form-wrapper">
        <div className="form-header">
          <h2>Login</h2>
          <p>Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="form-footer">
            <a href="/forgot" className="forgot-password">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
      
    </div>
   </div>
   </>
  )
}

export default Login
