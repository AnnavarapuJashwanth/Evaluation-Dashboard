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

// ✅ CORS setup (allow localhost for dev + Netlify for production)
const allowedOrigins = [
  "http://localhost:5173",             // Vite default dev server
  "http://localhost:3000",             // CRA dev
  "https://evaluation4297.netlify.app" // your Netlify deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("🚫 Blocked by CORS:", origin);
        callback(null, false); // don’t crash the server
      }
    },
    credentials: true,
  })
);

// ✅ Routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// ✅ Default route
app.get("/", (req, res) => res.send("API running"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
