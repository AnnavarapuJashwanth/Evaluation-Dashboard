import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizResults.css';

const QuizResults = ({ results, quiz, answers }) => {
  const navigate = useNavigate();
  
  // Add error handling for missing data
  if (!results || !quiz) {
    return (
      <div className="results-container">
        <div className="quiz-error">Results not available. Please try again.</div>
        <div className="results-actions">
          <button onClick={() => navigate('/quizzes')} className="action-btn">
            <i className="fas fa-arrow-left"></i> Back to Quizzes
          </button>
          <button onClick={() => window.location.reload()} className="action-btn secondary">
            <i className="fas fa-redo"></i> Try Again
          </button>
        </div>
      </div>
    );
  }

  const scorePercentage = results.percentageScore || (results.score / results.totalQuestions) * 100;
  const passed = results.passed || scorePercentage >= 60;

  // Calculate performance metrics
  const correctAnswers = results.answers.filter(answer => answer.isCorrect).length;
  const incorrectAnswers = results.totalQuestions - correctAnswers;
  const avgTimePerQuestion = (results.timeSpent / results.totalQuestions).toFixed(1);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Quiz Results</h2>
        <div className={`score-display ${passed ? 'passed' : 'failed'}`}>
          <div className="score-circle">
            <span className="score-text">{Math.round(scorePercentage)}%</span>
          </div>
          <div className="score-details">
            <h3>{passed ? 'Congratulations! You passed!' : 'Keep practicing!'}</h3>
            <p>Your Score: {results.score}/{results.totalQuestions}</p>
            <p>Time Spent: {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s</p>
          </div>
        </div>
      </div>

      <div className="results-content">
        <div className="performance-metrics">
          <div className="metric">
            <div className="metric-value">{correctAnswers}</div>
            <div className="metric-label">Correct</div>
          </div>
          <div className="metric">
            <div className="metric-value">{incorrectAnswers}</div>
            <div className="metric-label">Incorrect</div>
          </div>
          <div className="metric">
            <div className="metric-value">{avgTimePerQuestion}s</div>
            <div className="metric-label">Avg. Time/Q</div>
          </div>
          <div className="metric">
            <div className="metric-value">{passed ? 'Pass' : 'Fail'}</div>
            <div className="metric-label">Result</div>
          </div>
        </div>

        <div className="answers-review">
          <h3>Question Review</h3>
          <div className="review-list">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = results.answers[index]?.isCorrect;
              
              return (
                <div 
                  key={index} 
                  className={`question-review ${isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <div className="answer-comparison">
                    <div className="answer-row">
                      <span className="answer-label">Your answer:</span>
                      <span className={`user-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {userAnswer !== null && userAnswer !== undefined 
                          ? question.options[userAnswer] 
                          : 'Not answered'}
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button onClick={() => navigate('/quizzes')} className="action-btn">
          <i className="fas fa-arrow-left"></i> Back to Quizzes
        </button>
        <button onClick={() => navigate('/')} className="action-btn primary">
          <i className="fas fa-home"></i> Return to Dashboard
        </button>
        <button onClick={() => window.location.reload()} className="action-btn secondary">
          <i className="fas fa-redo"></i> Try Again
        </button>
      </div>
    </div>
  );
};

export default QuizResults;