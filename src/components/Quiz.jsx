import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Quiz.css";

// ✅ Common pattern for consistent API handling (Render + localhost)
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching quiz with token:", token ? "Present" : "Missing");

      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", res.data);

      if (res.data.success) {
        setQuiz(res.data.data);
        setAnswers(new Array(res.data.data.questions.length).fill(null));
      } else {
        setError(res.data.message || "Failed to fetch quiz");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching quiz:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load quiz. Please try again later."
        );
      }

      setQuiz(null);
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, option) => {
    const newAnswers = [...answers];
    newAnswers[index] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/quizzes/${id}/submit`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Submit Response:", res.data);

      if (res.data.success) {
        setResult(res.data.data);
        setSubmitted(true);
      } else {
        setError(res.data.message || "Failed to submit quiz");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError(
        err.response?.data?.message || "Failed to submit quiz. Try again later."
      );
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError("");
    fetchQuiz();
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading quiz...</div>;

  if (error.includes("Authentication") || error.includes("session")) {
    return (
      <div className="quiz-container">
        <div className="error auth-error">
          <p>{error}</p>
          <button onClick={handleLoginRedirect} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="quiz-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );

  if (!quiz) return <div className="no-quiz">No quiz found.</div>;

  if (submitted)
    return (
      <div className="quiz-results">
        <h2>Quiz Submitted Successfully!</h2>
        <p>
          You scored {result?.score ?? 0} out of{" "}
          {quiz.questions?.length ?? "N/A"}.
        </p>
        <button
          onClick={() =>
            navigate("/results", {
              state: { results: result, quiz, answers },
            })
          }
          className="view-results-btn"
        >
          View Detailed Results
        </button>
        <button onClick={() => navigate("/quizzes")} className="back-btn">
          Back to Quizzes
        </button>
      </div>
    );

  return (
    <div className="quiz-container">
      <h1>{quiz.title}</h1>
      <p className="quiz-description">{quiz.description}</p>

      {quiz.questions.map((q, index) => (
        <div key={index} className="question-card">
          <h3>
            Q{index + 1}. {q.question}
          </h3>
          <div className="options">
            {q.options.map((option, i) => (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSubmit} className="submit-quiz-btn">
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
