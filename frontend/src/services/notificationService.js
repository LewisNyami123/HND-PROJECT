import axios from "axios";

// ✅ In Vite, environment variables must be prefixed with VITE_
// Example in .env: VITE_API_URL=http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL;

export const getNotifications = async (token) => {
  if (!token) throw new Error("No token provided");

  const res = await axios.get(`${API_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
