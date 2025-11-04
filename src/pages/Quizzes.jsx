import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ 1. Import Framer Motion
import "./Quizzes.css";

// Common Pattern to Reuse (API_URL)
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

// ✅ 2. Define Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Animate cards one by one
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setQuizzes(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setQuizzes([]);
        setError(response.data.message || "Failed to fetch quizzes");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch quizzes. Please try again later."
        );
      }
      setQuizzes([]);
      setLoading(false);
    }
  };

  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleRetry = () => {
    setLoading(true);
    setError("");
    fetchQuizzes();
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading quizzes...</div>;

  const renderError = (errorMessage, buttonText, onClick) => (
    <motion.div
      className="container text-center" // ✅ Bootstrap class
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="error-container">
        <p>{errorMessage}</p>
        <button onClick={onClick} className="btn btn-primary"> {/* ✅ Bootstrap class */}
          {buttonText}
        </button>
      </div>
    </motion.div>
  );

  if (error.includes("Authentication") || error.includes("session")) {
    return renderError(error, "Go to Login", handleLoginRedirect);
  }

  if (error) {
    return renderError(error, "Retry", handleRetry);
  }

  return (
    // ✅ 3. Apply variants to motion components
    <motion.div
      className="quizzes-container container" // ✅ Bootstrap class
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center" variants={headerVariants}> {/* ✅ Bootstrap class */}
        <h1 className="display-4">Quiz Dashboard</h1> {/* ✅ Bootstrap class */}
        <p className="lead"> {/* ✅ Bootstrap class */}
          Test your knowledge in various subjects. Each quiz has a time limit as
          specified.
        </p>
      </motion.div>

      {quizzes.length === 0 ? (
        <motion.div
          className="no-quizzes"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <p>No quizzes available at the moment. Please check back later.</p>
          <div className="no-quizzes-actions">
            <button onClick={handleRetry} className="btn btn-primary"> {/* ✅ Bootstrap class */}
              Retry
            </button>
            <button onClick={() => navigate("/")} className="btn btn-secondary"> {/* ✅ Bootstrap class */}
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="quizzes-grid"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz._id}
              className={`quiz-card ${quiz.subject.toLowerCase()}`}
              variants={cardVariants} // ✅ Animate each card
            >
              <div className="quiz-card-content">
                <h3>{quiz.subject}</h3>
                <h4>{quiz.title}</h4>
                <p>{quiz.description}</p>
                <div className="quiz-details">
                  <span className="quiz-detail-item">
                    <i className="fas fa-question-circle"></i>{" "} {/* ✅ Changed icon */}
                    {quiz.questionCount || quiz.questions?.length || 0} questions
                  </span>
                  <span className="quiz-detail-item">
                    <i className="fas fa-clock"></i>{" "}
                    {quiz.timeLimit || 30} minutes
                  </span>
                  <span className="quiz-detail-item">
                    <i className="fas fa-star"></i>{" "}
                    {quiz.difficulty || "Medium"}
                  </span>
                  <span className="quiz-detail-item">
                    <i className="fas fa-trophy"></i>{" "}
                    {quiz.totalPoints || quiz.questions?.length || 0} points
                  </span>
                </div>
                <motion.button
                  onClick={() => startQuiz(quiz._id)}
                  className="start-quiz-btn"
                  whileHover={{ scale: 1.05 }} // ✅ Button animation
                  whileTap={{ scale: 0.95 }}   // ✅ Button animation
                >
                  Start Quiz
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quizzes;