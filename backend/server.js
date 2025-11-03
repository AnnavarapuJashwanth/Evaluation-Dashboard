const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const quizRoutes = require("./routes/quizzes");

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup with allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", // Vite default dev server
  "http://localhost:3000", // CRA dev
  "https://evaluation4297.netlify.app" // Netlify deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        console.warn("🚫 Blocked by CORS:", origin);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const assignmentRoutes = require("./routes/assignments");
const mentorRoutes = require("./routes/mentor");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/quizzes", quizRoutes);

// ✅ Health check route
app.get("/api/health", (req, res) =>
  res.json({ status: "OK", message: "API running 🚀" })
);

// ✅ Serve static files in production
// ✅ Serve static files in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(clientPath, "index.html"));
    } else {
      next();
    }
  });
}


// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// ✅ 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
