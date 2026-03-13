import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios  from 'axios' // Import axios

// ADD DEFAULT AUTH HEADER FOR AXIOS
const token = localStorage.getItem("token");
if(token){
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
// END ADD DEFAULT AUTH HEADER FOR AXIOS

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
