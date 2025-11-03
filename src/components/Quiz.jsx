import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import QuizResults from './QuizResults';
import './Quiz.css';

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !submitted) {
      // Set initial time based on quiz timeLimit
      const initialTime = (quiz.timeLimit || 30) * 60;
      setTimeLeft(initialTime);
     
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, submitted]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      const baseURL = import.meta.env.MODE === 'production' 
        ? '' 
        : 'http://localhost:5000';
      
      const response = await axios.get(`${baseURL}/api/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      if (response.data.success) {
        setQuiz(response.data.data);
        setAnswers(new Array(response.data.data.questions.length).fill(null));
      } else {
        setError(response.data.message || 'Failed to fetch quiz');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch quiz');
      }
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      const baseURL = import.meta.env.MODE === 'production' 
        ? '' 
        : 'http://localhost:5000';
      
      // Prepare answers data properly - handle unanswered questions
      const answersData = answers.map((answer, index) => ({
        questionIndex: index,
        selectedOption: answer !== null && answer !== undefined ? answer : -1,
        timeSpent: 0
      }));

      console.log('Submitting quiz:', {
        quizId: id,
        answersCount: answersData.length,
        timeSpent: (quiz.timeLimit * 60) - timeLeft
      });

      const response = await axios.post(`${baseURL}/api/quizzes/${id}/submit`, {
        answers: answersData,
        timeSpent: (quiz.timeLimit * 60) - timeLeft
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success) {
        setResults(response.data.data);
        setSubmitted(true);
      } else {
        setError(response.data.message || 'Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      
      // SPECIFIC ERROR HANDLING FOR PERCENTAGE SCORE ISSUE
      if (err.response?.status === 500) {
        const errorMessage = err.response.data?.message || '';
        if (errorMessage.includes('percentageScore') || errorMessage.includes('Percentage score cannot exceed 100')) {
          setError('Scoring error occurred. Please try submitting again or contact support.');
        } else {
          setError('Server error. Please try again later.');
        }
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid data submitted');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit quiz. Please try again.');
      }
    }
  };

  if (loading) return <div className="quiz-loading">Loading quiz...</div>;
  if (error) return <div className="quiz-error">{error}</div>;
  if (!quiz) return <div className="quiz-error">Quiz not found</div>;

  if (submitted && results) {
    return <QuizResults results={results} quiz={quiz} answers={answers} />;
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className={`timer ${timeLeft < 300 ? 'danger' : timeLeft < 600 ? 'warning' : ''}`}>
          <i className="fas fa-clock"></i> Time Left: {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="question-container">
        <h3 className="question-number">Question {currentQuestion + 1}</h3>
        <p className="question-text">{question.question}</p>
       
        <div className="options-container">
          {question.options.map((option, index) => (
            <div key={index} className="option">
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(index)}
              />
              <label htmlFor={`option-${index}`}>
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="nav-btn prev-btn"
        >
          <i className="fas fa-arrow-left"></i> Previous
        </button>
       
        <div className="question-indicator">
          {currentQuestion + 1} / {quiz.questions.length}
        </div>
       
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="nav-btn submit-btn"
          >
            Submit Quiz <i className="fas fa-paper-plane"></i>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="nav-btn next-btn"
          >
            Next <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;