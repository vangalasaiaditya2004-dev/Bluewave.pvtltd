// AI routes for fetching real-time database-driven insights.

const express = require("express");
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected AI endpoint
router.get("/", authMiddleware, aiController.getAIInsights);
router.get("/insights", authMiddleware, aiController.getAIInsights);
router.get("/demand-insight", authMiddleware, aiController.getAIInsights);

module.exports = router;
