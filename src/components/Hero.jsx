import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import "./Hero.css";

// --- Framer Motion Variants ---

// Parent container variant to manage staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Each child animates 0.2s after the previous one
    }
  }
};

// Child variant for text elements fading in and up
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

// Child variant for the image
const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        {/* Use the 'motion.div' as the container for animations.
          'initial' sets the starting state (hidden).
          'animate' sets the final state (visible).
          'variants' points to our defined animations.
        */}
        <motion.div 
          className="row align-items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side (Text Content) */}
          <div className="col-md-6 col-lg-7 text-content">
            {/* Each of these is now a motion component and will use the parent's stagger */}
            <motion.h1 variants={fadeInUpVariants} className="hero-title">
              Smart Evaluation Platform
            </motion.h1>
            <motion.p variants={fadeInUpVariants} className="hero-lead">
              Transform your learning experience with AI-powered evaluations,
              real-time feedback, and performance analytics.
            </motion.p>
            <motion.div variants={fadeInUpVariants} className="hero-buttons">
              <Link to="/signup" className="btn btn-hero-primary me-3">
                Get Started
              </Link>
              <a href="#features" className="btn btn-hero-secondary">
                Explore Features
              </a>
            </motion.div>
          </div>

          {/* Right side (Image) */}
          <div className="col-md-6 col-lg-5 text-center">
            {/* The image gets its own animation variant */}
            <motion.img
              variants={imageVariants}
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&h=400&q=80"
              alt="Students learning in a modern environment"
              className="img-fluid hero-image"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;