import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaClock, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import "../styles/TakeExam.css";
import { toast } from "react-toastify";

function TakeExam() {
 const { examId } = useParams();
 console.log("ExamId from params:", examId);
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper: Calculate score
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

  // Handle submit (manual or auto)
  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const finalScore = calculateScore();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/results",
        {
          exam: exam._id,
          answers,
          score: finalScore,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setScore(finalScore);
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Failed to submit exam. Your answers may not be saved.");
      setSubmitted(false); // Allow retry
    }
  };

  // Fetch exam data
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
        console.error(err);
        toast.error(err.response?.data?.message || "Cannot load exam. It may not be available.");
        navigate("/exams");
      }
    };
    fetchExam();
    
  }, [examId, navigate]);

  // Timer countdown + auto-submit
  useEffect(() => {
    if (loading || submitted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, submitted, timeLeft]);

  // Loading state
  if (loading) {
    return <div className="loading">Loading exam...</div>;
  }
console.log("Link to:", `/take/${exam._id}`);
console.log("Exam ID:", exam._id);
  // Submitted state
  if (submitted) {
    return (
      <div className="submitted-screen">
        <FaCheckCircle className="icon success" />
        <h2>Exam Submitted!</h2>
        <p className="score">
          Your score: <strong>{score ?? "Calculating..."}</strong> out of{" "}
          <strong>{exam.questions.length}</strong>
        </p>
        <p>Redirecting to results in 5 seconds...</p>
        {setTimeout(() => navigate("/results"), 5000)}
      </div>
    );
  }

  // Main exam view
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
        {exam.questions.map((question, index) => (
          <div key={question._id} className="question">
            <h3>
              Question {index + 1} of {exam.questions.length}
            </h3>
            <p className="question-text">{question.text}</p>

            <div className="options">
              {question.options.map((option, i) => (
                <label key={i} className="option">
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() => handleAnswer(question._id, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        <FaPaperPlane />
        Submit Exam
      </button>
    </div>
  );
}

export default TakeExam;