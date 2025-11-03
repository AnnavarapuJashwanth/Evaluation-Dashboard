import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./Mentor.css";

function Mentor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  // ✅ Auto-scroll chat to bottom
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
        "http://localhost:5000/api/mentor/chat",
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
        content: res.data.reply || "⚠️ Mentor couldn’t reply just now.",
      };

      // Natural delay
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err.response?.data || err.message);
      const errMsg = {
        id: Date.now() + "-err",
        role: "assistant",
        content:
          (err.response?.data?.error || err.response?.data?.msg) ??
          "❌ Something went wrong. Please try again later.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // ✨ Bubble animations
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
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <header className="mentor-header d-flex align-items-center p-3 border-bottom">
          <div className="mentor-brand d-flex align-items-center gap-3">
            <motion.div
              className="mentor-avatar"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              🤖
            </motion.div>
            <div>
              <h3 className="mb-0 fw-bold">AI Mentor</h3>
              <small className="text-muted">
                Get instant help with assignments, projects & study tips
              </small>
            </div>
          </div>
        </header>

        {/* Chat box */}
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
                layout
              >
                {m.role === "assistant" && (
                  <motion.div
                    className="avatar-ai"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    🤖
                  </motion.div>
                )}
                <div className="bubble-wrap">
                  <motion.div
                    className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="mb-0">{m.content}</p>
                  </motion.div>
                  <div className="bubble-meta">
                    <small>{m.role === "user" ? "You" : "Mentor"}</small>
                  </div>
                </div>
                {m.role === "user" && (
                  <motion.div
                    className="avatar-user"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    🧑
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <motion.div
                key="typing"
                className="chat-row chat-ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="avatar-ai">🤖</div>
                <div className="bubble-wrap">
                  <div className="bubble bubble-ai typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                  <div className="bubble-meta">
                    <small>Mentor is typing...</small>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input box */}
        <form className="mentor-input d-flex p-3 border-top" onSubmit={sendMessage}>
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#ff4d4d" }}
            className="form-control me-3"
            placeholder="Ask your mentor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <motion.button
            className="btn send-btn"
            type="submit"
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {loading ? "..." : "Send"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Mentor;
