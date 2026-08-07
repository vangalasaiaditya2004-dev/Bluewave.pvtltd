// Report routes.

const express = require("express");
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// These report routes are protected with JWT authentication.
router.get("/financial", authMiddleware, reportController.getFinancialReports);
router.get("/inventory", authMiddleware, reportController.getInventoryReports);
router.get("/demand-forecasts", authMiddleware, reportController.getDemandForecastReports);

module.exports = router;
