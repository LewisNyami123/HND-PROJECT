import { useEffect, useState } from "react";
import api from "../axiosInstance"
import Countdown from "./Countdown";
import "../styles/Exams.css";

function CountDownPage() {
  const [nextExam, setNextExam] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const upcoming = res.data
        .filter(e => e.scheduledTime)
        .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

      setNextExam(upcoming[0] || null);
    };
    fetchExams();
  }, []);
  


  return (
    <div className="countdown-page">
      <h2>Next Exam Countdown</h2>
      {nextExam ? (
        <div className="next-exam-card">
          <h3>{nextExam.title}</h3>
          <p><strong>Course:</strong> {nextExam.course}</p>
          <p><strong>Level:</strong> {nextExam.level}</p>
          <p><strong>Scheduled:</strong> {new Date(nextExam.scheduledTime).toLocaleString()}</p>
          <Countdown scheduledTime={nextExam.scheduledTime} />
          <p>{new Date().toLocaleTimeString()}</p>

        </div>
      ) : (
        <p>No upcoming exams found</p>
      )}
      
    </div>
  );
}

export default CountDownPage;