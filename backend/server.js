const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { errorHandler } = require("./utils/errorHandler");

// Load environment variables BEFORE importing routes that read them
dotenv.config();

// Routes
const donorRoutes = require("./routes/donorRoutes");
const wishlistRoutes = require("./routes/wishlist");
const schemesRoutes = require("./routes/schemesRoutes");
const jobRoutes = require("./routes/jobRoutes");
const disabledRoutes = require("./routes/disabled"); // Import disabled routes with other routes
const donationRoutes = require("./routes/donationRoutes");

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-requested-with",
    "Access-Control-Allow-Origin",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Preflight requests are handled by the CORS middleware above in Express 5

// Enhanced debug logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);

  // Log request body for POST/PUT/PATCH requests
  if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
    console.log("Request body:", req.body);
  }

  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads", "wishlist");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory:", uploadsDir);
}

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add health check endpoints BEFORE other routes
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    endpoints: {
      health: "GET /",
      apiHealth: "GET /api/health",
      jobs: "GET /api/jobs",
      donorLogin: "POST /api/donors/login",
      donorRegister: "POST /api/donors/register",
      disabledLogin: "POST /api/disabled/login",
      disabledRegister: "POST /api/disabled/register",
      wishlist: "GET /api/wishlist",
      schemes: "GET /api/schemes",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    api: "operational",
  });
});

// MongoDB Connection with better error handling
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/donation-app";
console.log("Attempting to connect to MongoDB...");

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    console.log(
      `💳 Razorpay: ${
        process.env.RAZORPAY_KEY_ID
          ? "✅ Configured (Test Mode)"
          : "❌ Not Configured"
      }`
    ); // ADD THIS
    console.log("Database name:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // Don't exit the process, continue without DB for testing
    console.log("⚠️  Continuing without database connection...");
  });

// MongoDB connection event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

// Routes registration with error handling
console.log("Registering API routes...");

try {
  // Mount routes
  app.use("/api/donors", donorRoutes);
  console.log("✅ Donor routes registered at /api/donors");
} catch (error) {
  console.error("❌ Error registering donor routes:", error.message);
}

try {
  app.use("/api/disabled", disabledRoutes);
  console.log("✅ Disabled routes registered at /api/disabled");
} catch (error) {
  console.error("❌ Error registering disabled routes:", error.message);
}

try {
  app.use("/api/wishlist", wishlistRoutes);
  console.log("✅ Wishlist routes registered at /api/wishlist");
} catch (error) {
  console.error("❌ Error registering wishlist routes:", error.message);
}

try {
  app.use("/api/schemes", schemesRoutes);
  console.log("✅ Schemes routes registered at /api/schemes");
} catch (error) {
  console.error("❌ Error registering schemes routes:", error.message);
}

try {
  app.use("/api/jobs", jobRoutes);
  console.log("✅ Job routes registered at /api/jobs");
} catch (error) {
  console.error("❌ Error registering job routes:", error.message);
}
try {
  app.use("/api/donations", donationRoutes); // ADD THIS
  console.log("✅ Donation routes registered at /api/donations");
} catch (error) {
  console.error("❌ Error registering donation routes:", error.message);
}

console.log("All routes registered successfully");

// Add a test route for debugging
app.get("/api/test", (req, res) => {
  res.json({
    message: "API test route working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: req.headers,
  });
});

// Handle undefined routes with more detailed error
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;

  console.log(
    `❌ 404 Error - Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /api/health",
      "GET /api/test",
      "GET /api/jobs",
      "POST /api/donors/login",
      "POST /api/donors/register",
      "POST /api/disabled/login",
      "POST /api/disabled/register",
      "GET /api/wishlist",
      "POST /api/wishlist",
      "GET /api/schemes",
    ],
  });
});

// Enhanced global error handler
app.use((error, req, res, next) => {
  console.error("❌ Global Error Handler:");
  console.error("Error message:", error.message);
  console.error("Stack trace:", error.stack);
  console.error("Request details:", {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
  });

  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      details: error,
    }),
  });
});

const PORT = process.env.PORT || 5000;

// Start server with enhanced configuration
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("\n🚀 Server Started Successfully!");
  console.log("==========================================");
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 Network URL: http://0.0.0.0:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Database: ${mongoUri}`);
  console.log("\n📋 Available Endpoints:");
  console.log("  GET  /                    - Server status");
  console.log("  GET  /health              - Health check");
  console.log("  GET  /api/health          - API health check");
  console.log("  GET  /api/test            - Test endpoint");
  console.log("  GET  /api/jobs            - Job listings");
  console.log("  POST /api/donors/login    - Donor login");
  console.log("  POST /api/donors/register - Donor register");
  console.log("  POST /api/disabled/login  - User login");
  console.log("  POST /api/disabled/register - User register");
  console.log("  GET  /api/wishlist        - Get wishlists");
  console.log("  POST /api/wishlist        - Create wishlist");
  console.log("  GET  /api/schemes         - Get schemes");
  console.log("==========================================\n");
  console.log("  POST /api/donations/create-order    - Create payment order");
  console.log("  POST /api/donations/verify-payment  - Verify payment");
  console.log("  GET  /api/donations/history/:pwdId  - Donation history");
  console.log("  GET  /api/donations/my-donations    - My donations");
  console.log("  GET  /api/donations/stats/:pwdId    - Donation stats");

  console.log("✅ Server is ready to accept connections!");
});

// Enhanced server error handling
server.on("error", (error) => {
  console.error("❌ Server startup error:");

  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Please try one of these solutions:`
    );
    console.error("1. Kill the process using this port:");
    console.error(`   lsof -ti:${PORT} | xargs kill -9`);
    console.error("2. Use a different port:");
    console.error(`   PORT=5001 npm start`);
    console.error("3. Or change PORT in your .env file");
  } else if (error.code === "EACCES") {
    console.error(`Permission denied to bind to port ${PORT}`);
    console.error(
      "Try using a port number > 1024 or run with sudo (not recommended)"
    );
  } else {
    console.error("Error details:", error);
  }

  process.exit(1);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    console.log("✅ HTTP server closed.");

    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed.");
      console.log("👋 Server shutdown complete.");
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(
      "❌ Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled rejections and exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});
