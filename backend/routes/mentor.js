// backend/routes/mentor.js
const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");
const Chat = require("../models/Chat");

const router = express.Router();

// ✅ POST /api/mentor/chat
router.post("/chat", auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ msg: "Message is required" });
    }

    console.log("📝 Incoming user message:", message);

    // ✅ Gemini API call
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(geminiURL, {
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    console.log("🤖 Gemini raw response:", JSON.stringify(response.data, null, 2));

    // ✅ Extract AI reply
    const aiReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "🤖 I couldn’t generate a response. Please try again.";

    // ✅ Save chat to DB
    let chat = await Chat.findOne({ userId: req.user.id });
    if (!chat) {
      chat = new Chat({ userId: req.user.id, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("❌ Mentor API Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Something went wrong with AI Mentor. Please try again later.",
    });
  }
});

module.exports = router;
