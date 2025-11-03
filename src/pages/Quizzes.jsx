import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Quizzes.css';

// ✅ Common Pattern to Reuse (API_URL)
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching quizzes with token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
     
      // ✅ Use unified API_URL (replaces baseURL)
      const response = await axios.get(`${API_URL}/api/quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      console.log('API Response:', response.data);
     
      // Handle the response format
      if (response.data.success) {
        setQuizzes(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setQuizzes([]);
        setError(response.data.message || 'Failed to fetch quizzes');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      console.error('Error response:', err.response?.data);
     
      // Handle authentication errors
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        // Redirect to login page after a delay
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch quizzes. Please try again later.');
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
    setError('');
    fetchQuizzes();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading quizzes...</div>;
  
  if (error.includes('Authentication') || error.includes('session')) {
    return (
      <div className="quizzes-container">
        <div className="error auth-error">
          <p>{error}</p>
          <button onClick={handleLoginRedirect} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="quizzes-container">
      <div className="error">
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-btn">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="quizzes-container">
      <h1>Quiz Dashboard</h1>
      <p>Test your knowledge in various subjects. Each quiz has a time limit as specified.</p>
     
      {quizzes.length === 0 ? (
        <div className="no-quizzes">
          <p>No quizzes available at the moment. Please check back later.</p>
          <div className="no-quizzes-actions">
            <button onClick={handleRetry} className="retry-btn">
              Retry
            </button>
            <button onClick={() => navigate('/')} className="home-btn">
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="quizzes-grid">
          {quizzes.map(quiz => (
            <div key={quiz._id} className={`quiz-card ${quiz.subject.toLowerCase()}`}>
              <div className="quiz-card-content">
                <h3>{quiz.subject}</h3>
                <h4>{quiz.title}</h4>
                <p>{quiz.description}</p>
                <div className="quiz-details">
                  <span className="quiz-detail-item">
                    <i className="fas fa-question"></i> {quiz.questionCount || quiz.questions?.length || 0} questions
                  </span>
                  <span className="quiz-detail-item">
                    <i className="fas fa-clock"></i> {quiz.timeLimit || 30} minutes
                  </span>
                  <span className="quiz-detail-item">
                    <i className="fas fa-star"></i> {quiz.difficulty || 'Medium'}
                  </span>
                  <span className="quiz-detail-item">
                    <i className="fas fa-trophy"></i> {quiz.totalPoints || quiz.questions?.length || 0} points
                  </span>
                </div>
                <button
                  onClick={() => startQuiz(quiz._id)}
                  className="start-quiz-btn"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
