import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} EvalHub. All Rights Reserved.</p>
        <p>
          Made with ❤️ by EvalHub Team
        </p>
      </div>
    </footer>
  );
}

export default Footer;
