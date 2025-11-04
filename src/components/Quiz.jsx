import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Quiz.css";

// Handle both local dev and deployed Render API
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1, // Animate children one by one
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // State for Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerWarning, setTimerWarning] = useState(false);
  const [timerDanger, setTimerDanger] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  // Helper function to format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setQuiz(res.data.data);
        setAnswers(new Array(res.data.data.questions.length).fill(null));
        const durationInSeconds = (res.data.data.duration || 10) * 60;
        setTimeLeft(durationInSeconds);
      } else {
        setError(res.data.message || "Failed to fetch quiz");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError("Failed to load quiz. Please try again later.");
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[index] = optionIndex;
    setAnswers(newAnswers);
  };

  // Using React.useCallback to stabilize handleSubmit function
  const handleSubmit = React.useCallback(async () => {
    if (submitted) return; // Prevent double submission

    setSubmitted(true); // Set submitted true *immediately*

    if (!quiz) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const formattedAnswers = answers.map((selectedOption, index) => ({
        questionIndex: index,
        selectedOption:
          selectedOption !== null && selectedOption !== undefined
            ? selectedOption
            : -1,
        timeSpent: 0,
      }));

      // Prevent submission if quiz has no questions
      if (formattedAnswers.length === 0) {
        setError("This quiz has no questions and cannot be submitted.");
        return;
      }
      
      const durationInSeconds = (quiz.duration || 10) * 60;
      const calculatedTimeSpent = durationInSeconds - (timeLeft || 0);

      const res = await axios.post(
        `${API_URL}/api/quizzes/${id}/submit`,
        { answers: formattedAnswers, timeSpent: calculatedTimeSpent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setResult(res.data.data); // This data now includes quizReview from your backend
      } else {
        setError(res.data.message || "Failed to submit quiz");
      }
    } catch (err) {
      
      // ✅ --- THIS IS THE FIX --- ✅
      // This will log the *specific error message* from your backend.
      console.error(
        "Backend submission error:",
        err.response ? err.response.data : err.message
      );
      // ✅ --------------------------

      setError(
        err.response?.data?.message || "Failed to submit quiz. Try again later."
      );
    }
  }, [quiz, submitted, answers, id, timeLeft]);

  // useEffect for Timer Countdown
  useEffect(() => {
    if (timeLeft === null || submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    setTimerDanger(timeLeft <= 60); // 1 minute left
    setTimerWarning(timeLeft > 60 && timeLeft <= 300); // 5 minutes left

    return () => clearInterval(intervalId);
  }, [timeLeft, submitted, handleSubmit]);


  const handleRetry = () => {
    setLoading(true);
    setError("");
    setSubmitted(false);
    setResult(null);
    fetchQuiz();
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const answeredQuestions = answers.filter((a) => a !== null).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const progressPercent =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  if (loading) return <div className="loading">Loading quiz...</div>;

  if (error.includes("Authentication") || error.includes("session")) {
    return (
      <motion.div
        className="quiz-container container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error auth-error">
          <p>{error}</p>
          <motion.button
            onClick={handleLoginRedirect}
            className="login-btn btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Login
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (error)
    return (
      <motion.div
        className="quiz-container container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error">
          <p>{error}</p>
          <motion.button
            onClick={handleRetry}
            className="retry-btn btn btn-warning"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );

  if (!quiz) return <div className="no-quiz">No quiz found.</div>;

  // This is the "Submitted" screen from your image. It shows while 'result' is being set.
  if (submitted && !result) {
    return <div className="loading">Submitting quiz, please wait...</div>
  }

  // This is the "Submitted" screen from your image.
  if (submitted && result)
    return (
      <motion.div
        className="quiz-results"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2>Quiz Submitted Successfully!</h2>
        <p>
          You scored {result?.score ?? 0} out of{" "}
          {quiz.questions?.length ?? "N/A"}.
        </p>
        <p>
          Percentage: {result?.percentageScore?.toFixed(2) ?? 0}%{" "}
          {result?.passed ? "✅ Passed" : "❌ Failed"}
        </p>

        {/* This passes the full result object to the results page */}
        <motion.button
          onClick={() =>
            navigate("/quiz-results", {
              state: { results: result }, 
            })
          }
          className="view-results-btn btn btn-success"
          whileHover={{ scale: 1.05 }}
        >
          View Detailed Results
        </motion.button>
        <motion.button
          onClick={() => navigate("/quizzes")}
          className="back-btn btn btn-secondary"
          whileHover={{ scale: 1.05 }}
        >
          Back to Quizzes
        </motion.button>
      </motion.div>
    );

  // This is the main quiz view
  return (
    <motion.div
      className="quiz-container container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        {timeLeft !== null && (
          <div
            className={`timer ${
              timerDanger ? "danger" : timerWarning ? "warning" : ""
            }`}
          >
            <i className="fas fa-clock" style={{ marginRight: "8px" }}></i>
            {formatTime(timeLeft)}
          </div>
        )}
      </div>
      <p className="quiz-description">{quiz.description}</p>

      <div className="progress-container">
        <div className="progress-bar">
          <motion.div
            className="progress"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="progress-text">
          {answeredQuestions} of {totalQuestions} questions answered
        </div>
      </div>

      {quiz.questions.map((q, index) => (
        <motion.div
          key={index}
          className="question-card"
          variants={itemVariants}
        >
          <h3>
            Q{index + 1}. {q.question}
          </h3>
          <div className="options">
            {q.options.map((option, i) => (
              <motion.label
                key={i}
                className="option-label"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={i}
                  checked={answers[index] === i}
                  onChange={() => handleAnswerChange(index, i)}
                />
                <span className="option-custom-radio"></span>
                <span className="option-text">{option}</span>
              </motion.label>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.button
        onClick={handleSubmit}
        className="submit-quiz-btn btn btn-primary btn-lg"
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.98, y: -1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Submit Quiz
      </motion.button>
    </motion.div>
  );
};

export default Quiz;