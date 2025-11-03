import React from "react";
import { Link } from "react-router-dom";
import "./Feature.css";

function Feature() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Platform Features</h2>
          <p className="section-subtitle">Discover our powerful evaluation tools</p>
        </div>
        
        <div className="features-grid">
          {/* Assignment Evaluation */}
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-file-alt"></i>
              <div className="icon-shape"></div>
            </div>
            <h3 className="feature-title">Assignment Evaluation</h3>
            <p className="feature-description">
              Upload assignments and get instant AI-powered evaluation with detailed feedback.
            </p>
            <Link to="/assignments" className="feature-btn">
              <span>Go to Assignments</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {/* Quiz Evaluation */}
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-list-check"></i>
              <div className="icon-shape"></div>
            </div>
            <h3 className="feature-title">Quiz & MCQ Evaluation</h3>
            <p className="feature-description">
              Attempt quizzes and get automated grading with performance insights.
            </p>
            <Link to="/quizzes" className="feature-btn">
              <span>Start Quiz</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {/* Project Submission */}
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-laptop-code"></i>
              <div className="icon-shape"></div>
            </div>
            <h3 className="feature-title">Project Submission</h3>
            <p className="feature-description">
              Submit projects and receive structured evaluations from both AI & mentors.
            </p>
            <Link to="/projects" className="feature-btn">
              <span>Submit Project</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {/* AI Mentor */}
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-robot"></i>
              <div className="icon-shape"></div>
            </div>
            <h3 className="feature-title">AI Mentor</h3>
            <p className="feature-description">
              Get AI-driven guidance and personalized suggestions for improvement.
            </p>
            <Link to="/mentor" className="feature-btn">
              <span>Ask Mentor</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {/* Dashboard */}
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
              <div className="icon-shape"></div>
            </div>
            <h3 className="feature-title">Performance Dashboard</h3>
            <p className="feature-description">
              Visualize grades, rankings, and activity logs with detailed analytics.
            </p>
            <Link to="/dashboard" className="feature-btn">
              <span>View Dashboard</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {/* Reports */}
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-file-alt"></i>
              <div className="icon-shape"></div>
            </div>
            <h3 className="feature-title">Reports & Articles</h3>
            <p className="feature-description">
              Generate professional reports & share articles while tracking student activity.
            </p>
            <Link to="/reports" className="feature-btn">
              <span>View Reports</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Feature;