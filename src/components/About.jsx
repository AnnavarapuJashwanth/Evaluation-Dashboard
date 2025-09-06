import React from "react";
import "./About.css";

function About() {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="fw-bold">About EvalHub</h2>
        <p className="lead mt-3">
          EvalHub is a smart evaluation platform built to enhance the learning
          journey of students. With AI-driven evaluations, real-time feedback,
          and performance insights, students and mentors can focus on
          improvement.
        </p>
        <button className="btn btn-primary">Learn More</button>
      </div>
    </section>
  );
}

export default About;
