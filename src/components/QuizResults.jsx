import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./QuizResults.css"; // We will use the new CSS file

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ UPDATED: This is the correct way to get data from Quiz.jsx
  const { results } = location.state || {};

  // ✅ UPDATED: This check is correct and looks for the data from your backend
  if (!results || !results.quizReview || !results.answers) {
    return (
      <motion.div
        className="results-container container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="quiz-error">
          <h3>Oops! Results are missing.</h3>
          <p>Please try taking the quiz again.</p>
        </div>
        <div className="results-actions">
          <motion.button 
            onClick={() => navigate("/quizzes")} 
            className="action-btn primary"
          >
            <i className="fas fa-arrow-left"></i> Back to Quizzes
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ✅ All data is now correctly read from the 'results' object
  const quiz = results.quizReview;
  const userAnswers = results.answers; // This is the *evaluated* array from backend
  const scorePercentage = results.percentageScore || 0;
  const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = results.totalQuestions - correctAnswers;
  const passed = results.passed;
  const avgTimePerQuestion = (
    (results.timeSpent || 0) / (results.totalQuestions || 1)
  ).toFixed(1);

  const chartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: { 
      legend: { 
        position: "bottom",
        labels: {
          font: { size: 14 },
          boxWidth: 20,
          padding: 20
        }
      } 
    },
  };

  return (
    <motion.div
      className="results-container container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Pass percentage to CSS for the animated ring
      style={{ "--score-percent": `${scorePercentage}%` }}
    >
      {/* Header */}
      <motion.div className="results-header" variants={itemVariants}>
        <h2>Quiz Results: {quiz.title}</h2>
      </motion.div>

      {/* Score Circle and Metrics Grid */}
      <motion.div className="performance-grid" variants={itemVariants}>
        
        {/* Score Circle */}
        <div className={`score-display ${passed ? "passed" : "failed"}`}>
          <div className="score-circle">
            <motion.span
              className="score-text"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{duration: 0.5, delay: 0.2, type: "spring"}}
            >
              {Math.round(scorePercentage)}%
            </motion.span>
          </div>
          <div className="score-details">
            <h3>{passed ? "🎉 You Passed!" : "😔 Keep Practicing!"}</h3>
            <p>
              Your Score: <span>{results.score} / {results.totalQuestions}</span>
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          className="performance-metrics"
          variants={containerVariants}
        >
          <motion.div className="metric" variants={itemVariants}>
            <div className="metric-value correct">{correctAnswers}</div>
            <div className="metric-label">Correct</div>
          </motion.div>
          <motion.div className="metric" variants={itemVariants}>
            <div className="metric-value incorrect">{incorrectAnswers}</div>
            <div className="metric-label">Incorrect</div>
          </motion.div>
           <motion.div className="metric" variants={itemVariants}>
            <div className="metric-value">
              {Math.floor((results.timeSpent || 0) / 60)}m{" "}
              {(results.timeSpent || 0) % 60}s
            </div>
            <div className="metric-label">Time Spent</div>
          </motion.div>
          <motion.div className="metric" variants={itemVariants}>
            <div className="metric-value">{avgTimePerQuestion}s</div>
            <div className="metric-label">Avg. Time/Q</div>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Chart */}
      <motion.div className="chart-container" variants={itemVariants}>
        <h4>Performance Breakdown</h4>
        <div className="chart-wrapper">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Review Questions */}
      <motion.div className="answers-review" variants={itemVariants}>
        <h3>Detailed Quiz Review</h3>
        <motion.div className="review-list" variants={containerVariants}>
          <AnimatePresence>
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer.isCorrect;
              const userAnswerIndex = userAnswer.selectedOption;

              return (
                <motion.div
                  key={index}
                  className={`question-review ${
                    isCorrect ? "correct" : "incorrect"
                  }`}
                  variants={itemVariants}
                  layout
                >
                  <div className="question-header">
                    <span className="question-number">
                      {isCorrect ? "✅" : "❌"} Q{index + 1}
                    </span>
                    <span
                      className={`result-badge ${
                        isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <div className="answer-comparison">
                    <div className="answer-row">
                      <span className="answer-label">Your answer:</span>
                      <span
                        className={`user-answer ${
                          isCorrect ? "correct" : "incorrect"
                        }`}
                      >
                        {userAnswerIndex !== -1
                          ? question.options[userAnswerIndex]
                          : "Not answered"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="answer-row">
                        <span className="answer-label">Correct answer:</span>
                        <span className="correct-answer">
                          {question.options[question.correctAnswer]}
                        </span>
                      </div>
                    )}
                  </div>
                  {question.explanation && (
                    <div className="explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Buttons */}
      <motion.div className="results-actions" variants={itemVariants}>
        <motion.button
          onClick={() => navigate("/quizzes")}
          className="action-btn primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-arrow-left"></i> Return to Quizzes
        </motion.button>
        <motion.button
          onClick={() => navigate(`/quiz/${results.quiz}`)} // Navigate back to the quiz
          className="action-btn secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-redo"></i> Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default QuizResults;