import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Register.css";
const Register = () => {
  const [form, setForm] = useState({
    // ✅ REAL DATA (sent to backend)
    name: "",
    email: "",
    password: "",
    role: "",
    level: "",
    department: "",

    // 🔮 FUTURE FIELDS (NOT sent yet)
    phone: "",
    gender: "",
    dob: "",
    address: "",
    matricule: "",
    faculty: "",
    course: "",
    profilePicture: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveData = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please login.");
        return;
      }

      // ✅ ONLY SEND REQUIRED DATA TO BACKEND
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        level: form.level,
        department: form.department
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
       res.data.message && toast.success(res.data.message);
      toast.success("User registered. Credentials sent to email.");

      // reset form
      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
        level: "",
        department: "",
        phone: "",
        gender: "",
        dob: "",
        address: "",
        matricule: "",
        faculty: "",
        course: "",
        profilePicture: ""
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
   
      <form onSubmit={saveData} className="register-form">
          <h2>Register New User</h2>
        {/* ✅ BASIC INFO */}
        <input type="text" name="name" placeholder="Full Name"
          value={form.name} onChange={handleChange} required />

        <input type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required />

        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>

        {/* 🎓 STUDENT FIELDS */}
        {form.role === "student" && (
          <>
            <input type="text" name="level" placeholder="Level (e.g. 200)"
              value={form.level} onChange={handleChange} required />

            <select name="department" value={form.department} 
            onChange={(e) => setForm({ ...form, department: e.target.value })} required style={{ 
              padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }} > 
              <option value="">Select Department</option> <option value="Computer Engineering">Computer Engineering</option> 
              <option value="Laboratory Technician">Laboratory Technician</option> 
              <option value="Electric Engineering">Electric Engineering</option>
               <option value="Midwife">Midwife</option> <option value="Nursing">Nursing</option> 
               <option value="Public Health">Public Health</option>
             <option value="Agricultural Engineering">Agricultural Engineering</option> </select>
          </>
        )}

        {/* 👨‍🏫 FACULTY FIELDS */}
        {form.role === "faculty" && (
          <>
            <input type="text" name="department" placeholder="Department"
              value={form.department} onChange={handleChange} required />

            <input type="text" name="course" placeholder="Course (Future field)"
              value={form.course} onChange={handleChange} />
          </>
        )}

        {/* 🔮 FUTURE PLACEHOLDER SECTION */}
        <hr />
        <h4>Additional Info (Future Use)</h4>

        <input type="text" name="phone" placeholder="Phone (optional)"
          value={form.phone} onChange={handleChange} />

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Gender (optional)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input type="date" name="dob"
          value={form.dob} onChange={handleChange} />

        <input type="text" name="address" placeholder="Address"
          value={form.address} onChange={handleChange} />

        <input type="text" name="matricule" placeholder="Matricule (Future)"
          value={form.matricule} onChange={handleChange} />

        <input type="text" name="faculty" placeholder="Faculty"
          value={form.faculty} onChange={handleChange} />

        {/* 🚀 SUBMIT */}
        <button type="submit">Register</button>

      </form>

      {/* <p className="warning">
        ⚠️ User will receive login credentials via email. Must change password after first login.
     </p> */}
    </div>
  );
};

export default Register;