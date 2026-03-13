import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaBookOpen,
  FaCalendarAlt,
  FaTrophy,
  FaTimes,
  FaChartBar,
} from "react-icons/fa";
import "../styles/Admin.css";

function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch results", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
        }
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p className="text-gray-600 text-center">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
          <FaChartBar className="text-blue-600" />
          All Student Results
        </h2>

        {results.length === 0 ? (
          <div className="empty-state">
            <FaBookOpen />
            <p>No results recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table>
              <thead>
                <tr>
                  <th>
                    <FaUser className="inline mr-2" />
                    Student
                  </th>
                  <th>
                    <FaBookOpen className="inline mr-2" />
                    Exam
                  </th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>
                    <FaCalendarAlt className="inline mr-2" />
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => {
                  const isPass = result.score >= 50;
                  return (
                    <tr key={result._id}>
                      <td>
                        <div className="student-info">
                          <div className="student-avatar">
                            <FaUser />
                          </div>
                          <div>
                    <p className="font-medium text-gray-900">
                    {result.student?.name || "Unknown Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                    {result.student?.email || "N/A"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                    {result.student?.role} {result.student?.level && `• ${result.student.level}`}
                    </p>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium text-gray-800">
                        {result.exam?.title || "Unknown Exam"}
                      </td>
                      <td className="text-center">
                        <span className="text-xl font-bold text-gray-900">
                          {result.score}%
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`status-badge ${
                            isPass ? "status-pass" : "status-fail"
                          }`}
                        >
                          {isPass ? (
                            <>
                              <FaTrophy />
                              Pass
                            </>
                          ) : (
                            <>
                              <FaTimes />
                              Fail
                            </>
                          )}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">
                        {new Date(result.submissionTime).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminResults;