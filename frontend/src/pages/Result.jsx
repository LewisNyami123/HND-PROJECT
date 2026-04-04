import { useState, useEffect } from "react";
import api from "../axiosInstance"
import { FaChartLine, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/Results.css";

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const res = await api.get("/api/results", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched results:", res.data);

      // If backend wraps results in { results: [...] }
      const payload = Array.isArray(res.data) ? res.data : res.data.results;
      setResults(payload);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load results:", err);
      setLoading(false);
    }
  };
  fetchResults();
}, []);


  const getStatus = (score) => (score >= 50 ? "passed" : "failed");

  if (loading) {
    return <p className="text-center mt-12">Loading your results...</p>;
  }

  if (results.length === 0) {
    return (
      <div className="results-container">
        <h2 className="results-title">
          <FaChartLine style={{ marginRight: "10px" }} />
          Exam Results
        </h2>
        <p className="text-center text-gray-600 mt-8">No results yet. Take an exam to see your scores!</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2 className="results-title">
        <FaChartLine style={{ marginRight: "10px" }} />
        Exam Results
      </h2>

      <table className="results-table">
        <thead>
          <tr>
            <th>Exam</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res) => {
            const status = getStatus(res.score);
            const examTitle = res.exam?.title || "Unknown Exam";

            return (
              <tr key={res._id}>
                <td className="exam-title">{examTitle}</td>
                <td className="score">{res.score}%</td>
                <td className={`status ${status}`}>
                  {status === "passed" ? (
                    <>
                      <FaCheckCircle className="icon" />
                      Passed
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="icon" />
                      Failed
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Results;