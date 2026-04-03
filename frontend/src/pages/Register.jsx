import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    level: "",
    department: ""
  });

  const saveData = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      // ✅ Send only real email + details, backend generates credentials
      const res = await axios.post(
        "http://localhost:5000/api/auth/registerNewUser",
        {
          name: form.name,
          realEmail: form.email,
          role: form.role,
          level: form.level,
          department: form.department
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data);
      toast.success("User registered successfully. Temporary credentials will be sent to the email provided.");

      setForm({
        name: "",
        email: "",
        role: "",
        level: "",
        department: ""
      });
    } catch (err) {
      toast.error("Registration failed: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Register</h2>
      <form onSubmit={saveData} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%", maxWidth: "400px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Real Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
        />
        <select
          name="role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        {form.role === "student" && (
          <>
            <input
              type="text"
              name="level"
              placeholder="Level (e.g. 200)"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              required
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
            />
            <select
              name="department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
            >
              <option value="">Select Department</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Laboratory Technician">Laboratory Technician</option>
              <option value="Electric Engineering">Electric Engineering</option>
              <option value="Midwife">Midwife</option>
              <option value="Nursing">Nursing</option>
              <option value="Public Health">Public Health</option>
              <option value="Agricultural Engineering">Agricultural Engineering</option>
            </select>
          </>
        )}
        <button
          type="submit"
          style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}
        >
          Submit
        </button>
      </form>

      {/* ⚠️ Warning message */}
      <p style={{ marginTop: "15px", color: "#d9534f", fontSize: "14px", textAlign: "center" }}>
        ⚠️ Note: You will receive temporary login credentials by email. It is strongly recommended to update your email and password after your first login.
      </p>
    </div>
  );
};

export default Register;
