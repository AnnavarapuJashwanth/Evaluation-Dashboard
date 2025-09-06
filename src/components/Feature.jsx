import React from "react";
import { Link } from "react-router-dom";
import "./Feature.css";

function Feature() {
  return (
    <section id="features" className="container py-5">
      <h2 className="text-center fw-bold mb-4">Platform Features</h2>
      <div className="row text-dark">
        
        {/* Assignment Evaluation */}
        <div className="col-md-4 mb-4">
          <div className="card feature-card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fas fa-file-alt fa-2x text-primary mb-3"></i>
              <h5 className="card-title">Assignment Evaluation</h5>
              <p className="card-text">
                Upload assignments and get instant AI-powered evaluation with detailed feedback.
              </p>
              <Link to="/assignments" className="btn btn-primary btn-sm">Go to Assignments</Link>
            </div>
          </div>
        </div>

        {/* Quiz Evaluation */}
        <div className="col-md-4 mb-4">
          <div className="card feature-card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fas fa-list-check fa-2x text-success mb-3"></i>
              <h5 className="card-title">Quiz & MCQ Evaluation</h5>
              <p className="card-text">
                Attempt quizzes and get automated grading with performance insights.
              </p>
              <Link to="/quizzes" className="btn btn-success btn-sm">Start Quiz</Link>
            </div>
          </div>
        </div>

        {/* Project Submission */}
        <div className="col-md-4 mb-4">
          <div className="card feature-card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fas fa-laptop-code fa-2x text-warning mb-3"></i>
              <h5 className="card-title">Project Submission</h5>
              <p className="card-text">
                Submit projects and receive structured evaluations from both AI & mentors.
              </p>
              <Link to="/projects" className="btn btn-warning btn-sm">Submit Project</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="row text-dark">
        {/* AI Mentor */}
        <div className="col-md-4 mb-4">
          <div className="card feature-card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fas fa-robot fa-2x text-danger mb-3"></i>
              <h5 className="card-title">AI Mentor</h5>
              <p className="card-text">
                Get AI-driven guidance and personalized suggestions for improvement.
              </p>
              <Link to="/mentor" className="btn btn-danger btn-sm">Ask Mentor</Link>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="col-md-4 mb-4">
          <div className="card feature-card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fas fa-chart-line fa-2x text-info mb-3"></i>
              <h5 className="card-title">Performance Dashboard</h5>
              <p className="card-text">
                Visualize grades, rankings, and activity logs with detailed analytics.
              </p>
              <Link to="/dashboard" className="btn btn-info btn-sm text-white">View Dashboard</Link>
            </div>
          </div>
        </div>

        {/* Reports */}
        <div className="col-md-4 mb-4">
          <div className="card feature-card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fas fa-file-alt fa-2x text-secondary mb-3"></i>
              <h5 className="card-title">Reports & Articles</h5>
              <p className="card-text">
                Generate professional reports & share articles while tracking student activity.
              </p>
              <Link to="/reports" className="btn btn-secondary btn-sm">View Reports</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Feature;
