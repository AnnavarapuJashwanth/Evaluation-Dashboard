import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./Mentor.css";

// ✅ API URL setup
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

function Mentor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now() + "-u", role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/mentor/chat`,
        { message: text },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const aiMsg = {
        id: Date.now() + "-a",
        role: "assistant",
        content:
          res.data?.reply || "⚠️ Mentor couldn’t reply just now. Try again later.",
      };

      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("❌ Chat error:", err);
      const errMsg = {
        id: Date.now() + "-err",
        role: "assistant",
        content:
          err.response?.data?.msg ||
          "❌ Something went wrong with the mentor server.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const bubbleVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <div className="mentor-page container mt-5">
      <motion.div
        className="mentor-card shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="mentor-header d-flex align-items-center p-3 border-bottom">
          <div className="mentor-brand d-flex align-items-center gap-3">
            <div className="mentor-avatar">🤖</div>
            <div>
              <h3 className="mb-0 fw-bold">AI Mentor</h3>
              <small className="text-muted">
                Get instant help with assignments, projects & study tips
              </small>
            </div>
          </div>
        </header>

        <div ref={boxRef} className="mentor-chat-box p-3">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                className={`chat-row ${m.role === "user" ? "chat-user" : "chat-ai"}`}
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {m.role === "assistant" && <div className="avatar-ai">🤖</div>}
                <div className="bubble-wrap">
                  <div
                    className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}
                  >
                    <p className="mb-0">{m.content}</p>
                  </div>
                  <div className="bubble-meta">
                    <small>{m.role === "user" ? "You" : "Mentor"}</small>
                  </div>
                </div>
                {m.role === "user" && <div className="avatar-user">🧑</div>}
              </motion.div>
            ))}

            {loading && (
              <div className="chat-row chat-ai">
                <div className="avatar-ai">🤖</div>
                <div className="bubble bubble-ai typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <form className="mentor-input d-flex p-3 border-top" onSubmit={sendMessage}>
          <input
            className="form-control me-3"
            placeholder="Ask your mentor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn send-btn" type="submit" disabled={!input.trim() || loading}>
            {loading ? "..." : "Send"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Mentor;
