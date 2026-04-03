import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaClock, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import "../styles/TakeExam.css";
import { toast } from "react-toastify";

function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate score locally
  const calculateScore = () => {
    if (!exam || !exam.questions) return 0;
    let correct = 0;
    exam.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  // Handle answer selection
  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Submit exam
 const handleSubmit = useCallback(async () => {
  if (submitted) return;
  setSubmitted(true);

  const finalScore = calculateScore();
  try {
    const token = localStorage.getItem("token");

    // Get logged-in student ID from localStorage or a context
    const studentId = localStorage.getItem("studentId"); // <-- ensure you store this when logging in

    if (!studentId) {
      toast.error("Cannot find your student ID. Please re-login.");
      setSubmitted(false);
      return;
    }

    await axios.post(
      "http://localhost:5000/api/results",
      {
        examId: exam._id,   // backend expects examId
        studentId,          // backend expects studentId
        score: finalScore,
        answers
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setScore(finalScore);
    toast.success("Exam submitted successfully!");
  } catch (err) {
    console.error("Submit failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to submit exam. Your answers may not be saved.");
    setSubmitted(false); // allow retry
  }
}, [submitted, exam, answers]);
  // Fetch exam
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/exams/take/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(res.data);
        setTimeLeft(res.data.timeLeftSeconds || 0);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load exam:", err);
        toast.error(err.response?.data?.message || "Cannot load exam.");
        navigate("/exams");
      }
    };
    fetchExam();
  }, [examId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (loading || submitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, submitted, timeLeft, handleSubmit]);

  if (loading) return <div className="loading">Loading exam...</div>;

  if (submitted) {
    setTimeout(() => navigate("/results"), 5000);
    return (
      <div className="submitted-screen">
        <FaCheckCircle className="icon success" />
        <h2>Exam Submitted!</h2>
        <p className="score">
          Your score: <strong>{score ?? "Calculating..."}</strong> /{" "}
          <strong>{exam.questions.length}</strong>
        </p>
        <p>Redirecting to results in 5 seconds...</p>
      </div>
    );
  }

  return (
    <div className="take-exam">
      <div className="exam-header">
        <h1>{exam.title}</h1>
        <div className={`timer ${timeLeft < 300 ? "warning" : ""}`}>
          <FaClock />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="questions">
        {exam.questions.map((q, idx) => (
          <div key={q._id} className="question">
            <h3>Question {idx + 1} of {exam.questions.length}</h3>
            <p className="question-text">{q.text}</p>
            <div className="options">
              {q.options.map((opt, i) => (
                <label key={i} className="option">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={() => handleAnswer(q._id, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        <FaPaperPlane /> Submit Exam
      </button>
    </div>
  );
}

export default TakeExam;
