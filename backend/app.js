// Import Express to create the backend server.
const express = require("express");

// Import CORS so the frontend can call this backend.
const cors = require("cors");

// Load environment variables from .env into process.env.
require("dotenv").config();

// Import the database file so SQLite connects and creates tables on startup.
const db = require("./config/db");

// Import route files.
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const reportRoutes = require("./routes/reportRoutes");

// Import error middleware. It catches errors passed with next(error).
const errorMiddleware = require("./middleware/errorMiddleware");

// Create the Express app.
const app = express();

// Allow requests from other origins, such as a React frontend.
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Let Express read JSON request bodies.
app.use(express.json());

// Health check / status route for root and /api endpoints
app.get(["/", "/api"], (req, res) => {
  res.json({ success: true, message: "BlueWave Backend Running..." });
});

// Import controllers directly for fallback binding
const authController = require("./controllers/authController");

// Main API routes with aliases for authentication endpoints.
app.use("/api/auth", authRoutes);
app.post("/api/login", authController.login);
app.post("/api/signon", authController.login);
app.post("/api/signin", authController.login);
app.post("/api/signup", authController.register);
app.post("/api/register", authController.register);

// Additional mounts without /api prefix for maximum compatibility.
app.use("/auth", authRoutes);
app.post("/login", authController.login);
app.post("/signon", authController.login);
app.post("/signin", authController.login);
app.post("/signup", authController.register);
app.post("/register", authController.register);

app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/reports", reportRoutes);

// Friendly response for unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Central error handler should be registered after all routes.
app.use(errorMiddleware);

// Use the PORT from .env, or use 5000 if PORT is missing.
const PORT = process.env.PORT || 5000;

// Start the server only after SQLite has finished creating/verifying tables.
async function startServer() {
  try {
    await db.ready;

    app.listen(PORT, () => {
      console.log(`BlueWave Backend Running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server did not start because database setup failed:", error.message);
    process.exit(1);
  }
}

// Start automatically when running `node app.js` or `npm run dev`.
if (require.main === module) {
  startServer();
}

// Export app for simple tests or future use without starting another server.
module.exports = app;
