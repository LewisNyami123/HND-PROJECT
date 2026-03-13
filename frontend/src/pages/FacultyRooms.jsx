import { FaUniversity } from "react-icons/fa";
import "../styles/Faculty.css";

function FacultyRooms() {
  return (
    <div className="faculty-page">
      <div className="faculty-card">
        <h2><FaUniversity /> Hall Management</h2>
        <table className="faculty-table">
          <thead>
            <tr>
              <th>Hall</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Room A</td><td>50</td><td>Available</td></tr>
            <tr><td>Room B</td><td>40</td><td>Assigned</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FacultyRooms;