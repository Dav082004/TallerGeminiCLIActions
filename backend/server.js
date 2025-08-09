/**
 * TaskFlow Manager - Express Server
 * Simple Node.js server for the TaskFlow Manager demo
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-domain.com"]
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

// General middleware
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: require("../package.json").version,
    environment: process.env.NODE_ENV || "development",
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "TaskFlow Manager API",
    version: require("../package.json").version,
    description:
      "REST API for TaskFlow Manager - Demo for Gemini CLI workflows",
    endpoints: {
      "GET /api/health": "Health check",
      "GET /api/tasks": "Get all tasks",
      "POST /api/tasks": "Create a new task",
      "GET /api/tasks/:id": "Get task by ID",
      "PUT /api/tasks/:id": "Update task by ID",
      "DELETE /api/tasks/:id": "Delete task by ID",
      "GET /api/tasks/stats": "Get task statistics",
    },
    demo: {
      purpose: "Demonstrate Gemini CLI integration with GitHub Actions",
      workflows: [
        "Issue Triage - Automatic classification of GitHub issues",
        "PR Review - Automated code review with AI feedback",
        "AI Assistant - Conversational help with @gemini-cli commands",
      ],
    },
  });
});

// Serve the main application for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(isDevelopment && { stack: err.stack }),
    },
  });
});

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: {
      message: "API endpoint not found",
      path: req.originalUrl,
      method: req.method,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🎯 TaskFlow Manager Server Started
  
  📍 Local:     http://localhost:${PORT}
  📍 Network:   http://0.0.0.0:${PORT}
  
  🌟 Environment: ${process.env.NODE_ENV || "development"}
  🤖 Gemini CLI: Ready for demo workflows
  
  📚 API Docs:  http://localhost:${PORT}/api
  ❤️  Health:   http://localhost:${PORT}/api/health
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});

module.exports = app;
