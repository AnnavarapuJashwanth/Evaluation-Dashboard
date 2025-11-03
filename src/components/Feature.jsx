import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import "./Feature.css";

// --- Feature Data ---
// We move the data here to make it easier to manage.
// TODO: Replace the 'imageUrl' with your own images for each section.
const featuresData = [
  {
    title: "Assignment Evaluation",
    description: "Upload assignments and get instant AI-powered evaluation with detailed feedback.",
    link: "/assignments",
    btnText: "Go to Assignments",
    icon: "fas fa-file-alt",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1950" // Example: office desk
  },
  {
    title: "Quiz & MCQ Evaluation",
    description: "Attempt quizzes and get automated grading with performance insights.",
    link: "/quizzes",
    btnText: "Start Quiz",
    icon: "fas fa-list-check",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1950" // Example: people studying
  },
  {
    title: "Project Submission",
    description: "Submit projects and receive structured evaluations from both AI & mentors.",
    link: "/projects",
    btnText: "Submit Project",
    icon: "fas fa-laptop-code",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1950" // Example: laptop with code
  },
  {
    title: "AI Mentor",
    description: "Get AI-driven guidance and personalized suggestions for improvement.",
    link: "/mentor",
    btnText: "Ask Mentor",
    icon: "fas fa-robot",
    imageUrl: "https://img.freepik.com/premium-photo/artificial-intelligence-ai-machine-learning-business-internet-technology-concept-3d-render-illustration_628331-763.jpg?w=740" // Example: abstract AI/robot
  },
  {
    title: "Performance Dashboard",
    description: "Visualize grades, rankings, and activity logs with detailed analytics.",
    link: "/dashboard",
    btnText: "View Dashboard",
    icon: "fas fa-chart-line",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1950" // Example: person looking at charts
  },
  {
    title: "Reports & Articles",
    description: "Generate professional reports & share articles while tracking student activity.",
    link: "/reports",
    btnText: "View Reports",
    icon: "fas fa-file-alt",
    imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1950" // Example: person writing
  }
];

// --- Framer Motion Variants ---
const contentVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};


function Feature() {
  return (
    <div className="features-page-container">
      {/* Main Header */}
      <section className="features-main-header">
        <div className="section-header">
          <h2 className="section-title">Platform Features</h2>
          <p className="section-subtitle">Discover our powerful evaluation tools</p>
        </div>
      </section>

      {/* Scrolling Feature Sections */}
      {featuresData.map((feature, index) => (
        <motion.section
          key={feature.title}
          className="feature-scroll-section"
          style={{ backgroundImage: `url(${feature.imageUrl})` }}
        >
          {/* This div applies the dark overlay */}
          <div className="section-overlay"></div>

          {/* This div handles content alignment (left/right) */}
          <div className={`feature-content-wrapper ${index % 2 === 0 ? 'align-left' : 'align-right'}`}>
            <motion.div
              className="feature-content-box"
              variants={contentVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }} // Trigger when 30% is visible
            >
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <Link to={feature.link} className="feature-btn">
                <span>{feature.btnText}</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      ))}
    </div>
  );
}

export default Feature;