const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup
app.use(
  cors({
    origin: "https://evaluation4297.netlify.app/", // 🔹 replace with your Netlify frontend URL
    credentials: true,
  })
);

// Routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Default route
app.get("/", (req, res) => res.send("API running"));

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
