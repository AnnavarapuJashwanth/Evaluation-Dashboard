import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Footer.css"; // We will create new styles in this file

// --- Framer Motion Variants ---
const footerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Staggers the animation of each column
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

function Footer() {
  return (
    <footer className="site-footer">
      <motion.div
        className="container"
        variants={footerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Triggers when 30% is visible
      >
        <div className="row">
          {/* Column 1: Brand Info */}
          <motion.div className="col-lg-4 col-md-6 mb-4 mb-lg-0" variants={itemVariants}>
            <h5 className="footer-heading">EvalHub</h5>
            <p className="footer-description">
              Our mission is to revolutionize the learning process with
              cutting-edge AI, providing instant, accurate, and insightful
              evaluations for students and professionals.
            </p>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div className="col-lg-2 col-md-6 mb-4 mb-lg-0" variants={itemVariants}>
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#features">Features</a></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div className="col-lg-3 col-md-6 mb-4 mb-lg-0" variants={itemVariants}>
            <h5 className="footer-heading">Resources</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/documentation">Documentation</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </motion.div>

          {/* Column 4: Social Media */}
          <motion.div className="col-lg-3 col-md-6 mb-4 mb-lg-0" variants={itemVariants}>
            <h5 className="footer-heading">Follow Us</h5>
            <p>Get in touch on our social platforms.</p>
            <div className="social-icons">
              {/* Using <a> tags for external links. Add your links to href. */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
            </div>
          </motion.div>
        </div>

        {/* --- Bottom Bar --- */}
        <motion.div className="footer-bottom-bar" variants={itemVariants}>
          <p>© {new Date().getFullYear()} EvalHub. All Rights Reserved.</p>
          <p>Made with ❤️ by the EvalHub Team</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;