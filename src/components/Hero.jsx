import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section
      className="hero-section text-white d-flex align-items-center p-5"
      style={{ background: "linear-gradient(135deg, #4b6cb7, #182848)" }}
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Left side */}
          <div className="col-md-6">
            <h1 className="fw-bold display-5">Smart Evaluation Platform</h1>
            <p className="lead">
              Transform your learning experience with AI-powered evaluations,
              real-time feedback, and performance analytics.
            </p>
            <Link to="/signup" className="btn btn-light me-2">
              Get Started
            </Link>
            <a href="#features" className="btn btn-outline-light">
              Explore Features
            </a>
          </div>

          {/* Right side */}
          <div className="col-md-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&h=400&q=80"
              alt="Hero"
              className="img-fluid rounded shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
