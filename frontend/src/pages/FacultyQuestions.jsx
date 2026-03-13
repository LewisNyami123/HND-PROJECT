import { useState, useEffect } from "react";
import axios from "axios";
import { FaDatabase, FaPlus, FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/Faculty.css";
import RichTextEditor from "../components/RichTextEditor";

function FacultyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
  text: "",
  type: "MCQ",
  course: "",
  difficulty: "medium",
  marks: 1,
  correctAnswer: "",
  options: [],
  content: "" // 🆕 TipTap content
})
 const [editingQuestion, setEditingQuestion] = useState(null); // holds the question being edited
const [isEditing, setIsEditing] = useState(false);           // flag for edit mode

  // 🔄 Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
       toast.error("No token found. Please log in again.");
    return;
    }
        const res = await axios.get("http://localhost:5000/api/faculty/questions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load questions", err);
        toast.error("Error loading questions");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 📝 Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ➕ Add new question
  const handleSaveQuestion = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/faculty/questions", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(prev => [...prev, res.data]);
      toast.success("Question added!");
      setShowForm(false);
      setFormData({
        text: "",
        type: "MCQ",
        course: "",
        difficulty: "medium",
        marks: 1,
        correctAnswer: "",
        options: [],
      });
    } catch (err) {
      console.error("Failed to save question", err);
      toast.error("Error saving question");
    }
  };

  // ❌ Delete question
  const handleDeleteQuestion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/faculty/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(prev => prev.filter(q => q._id !== id));
      toast.info("Question deleted");
    } catch (err) {
      console.error("Failed to delete question", err);
      toast.error("Error deleting question");
    }
  };
   // ➕ Add new option
const addOption = () => {
  setFormData(prev => ({
    ...prev,
    options: [...prev.options, ""]
  }));
};

// ✏️ Update option text
const handleOptionChange = (index, value) => {
  const newOptions = [...formData.options];
  newOptions[index] = value;
  setFormData(prev => ({ ...prev, options: newOptions }));
};

// ❌ Remove option
const removeOption = (index) => {
  const newOptions = formData.options.filter((_, i) => i !== index);
  setFormData(prev => ({ ...prev, options: newOptions }));

};

// handle edit qustion
const handleUpdateQuestion = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:5000/api/faculty/questions/${editingQuestion._id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setQuestions(prev =>
      prev.map(q => q._id === editingQuestion._id ? res.data : q)
    );

    toast.success("Question updated!");
    setShowForm(false);
    setIsEditing(false);
    setEditingQuestion(null);
    setFormData({
      text: "",
      type: "MCQ",
      course: "",
      difficulty: "medium",
      marks: 1,
      correctAnswer: "",
      options: [],
      content: ""
    });
  } catch (err) {
    console.error("Failed to update question", err);
    toast.error("Error updating question");
  }
};
  return (
    <div className="faculty-page">
      <div className="faculty-card">
        <h2><FaDatabase /> Question Bank</h2>
        <p>Manage questions for different courses here.</p>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Question
        </button>
      </div>

      {/* 📋 Question List */}
      <div className="question-list">
        {loading ? (
          <p>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          questions.map((q) => (
            
            <div key={q._id} className="question-item">
              <h3>{q.text}</h3>
              <p><strong>Course:</strong> {q.course}</p>
              <p><strong>Type:</strong> {q.type}</p>
              <p><strong>Difficulty:</strong> {q.difficulty}</p>
              <p>
                <strong>Answer:</strong>{" "}
                {q.correctAnswer ? (
                  <span className="correct"><FaCheckCircle /> {q.correctAnswer}</span>
                ) : (
                  <span className="incorrect"><FaTimesCircle /> None</span>
                )}
              </p>
              <div className="question-actions">
                                      <button 
                        className="edit-btn" 
                        onClick={() => {
                          setEditingQuestion(q);
                          setFormData({
                            text: q.text,
                            type: q.type,
                            course: q.course,
                            difficulty: q.difficulty,
                            marks: q.marks,
                            correctAnswer: q.correctAnswer,
                            options: q.options || [],
                            content: q.content || ""
                          });
                          setIsEditing(true);
                          setShowForm(true);
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                <button className="delete-btn" onClick={() => handleDeleteQuestion(q._id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📝 Add Question Form */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
                      <button 
              className="close-btn" 
              onClick={() => setShowForm(false)}
            >
              <FaTimesCircle />
            </button>
            <h3><FaPlus /> New Question</h3>

            <form>
              <label>Question Text</label>
              <input name="text" value={formData.text} onChange={handleChange} />

              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="MCQ">MCQ</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
              </select>

              <label>Course</label>
              <input name="course" value={formData.course} onChange={handleChange} />

              <label>Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <label>Marks</label>
              <input name="marks" type="number" min="1" value={formData.marks} onChange={handleChange} />

              <label>Correct Answer</label>
              <input name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} />
              {formData.type === "MCQ" && (
  <div className="options-section">
                                  <label>Options</label>
                                  {formData.options.map((opt, index) => (
                                    <div key={index} className="option-item">
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                      />
                                      <button type="button" onClick={() => removeOption(index)}>
                                        <FaTrash /> Remove
                                      </button>
                                    </div>
                                  ))}
                                  <button type="button" onClick={addOption} className="add-btn">
                                    
                                    <FaPlus /> Add Option
                                  </button>
                                </div>
                              )}

               <label>Question Content</label>
                  {/* a liberay for rich editor called tiptap */}
                <RichTextEditor
                value={formData.content}
                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
              />
                                        <div className="form-actions">
                            {isEditing ? (
                              <button type="button" onClick={handleUpdateQuestion}>
                                <FaCheckCircle /> Update
                              </button>
                            ) : (
                              <button type="button" onClick={handleSaveQuestion}>
                                <FaCheckCircle /> Save
                              </button>
                            )}
                            <button type="button" onClick={() => setShowForm(false)}>
                              <FaTimesCircle /> Cancel
                            </button>
                          </div>
                                      </form>
                                    </div>
        </div>
      )}
    </div>
  );
}

export default FacultyQuestions;