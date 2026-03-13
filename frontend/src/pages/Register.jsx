import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import "../styles/Faculty.css";
import { toast } from 'react-toastify';

const Register = () => {
 const [form, setForm] = useState({
  name:"",
  email:"" ,
  password:"",
  role:"",
  level:"",
  department:""
 });

  const saveData =  async(e)=>{
      e.preventDefault();
      try{
        const token = localStorage.getItem("token");
        if(!token){
          console.log('No token found');
          return;
        }

     const res = await axios.post("http://localhost:5000/api/auth/register", form,{
      headers: { Authorization: `Bearer ${token}` }
     });
     console.log(res.data);
     toast.success("User registered successfully");
     setForm({
      name:"",
      email:"" ,
      password:"",
      role:"",
      level:"",
      department:""
     });
      }catch(err){
        toast.error("Registration failed: " + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={saveData}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} required />
        <select name="role" value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        {form.role === "student" && (
          <>
            <input type="text" name="level" placeholder="Level (e.g. 200)" value={form.level} onChange={(e)=>setForm({...form, level: e.target.value})} required />
            <select name="department" value={form.department} onChange={(e)=>setForm({...form, department: e.target.value})} required>
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
      </form>

    </div>
  )
}

export default Register
