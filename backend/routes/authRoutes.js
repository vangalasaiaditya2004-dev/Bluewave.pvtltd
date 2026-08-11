// Routes for registration, login, and viewing the logged-in user profile.

const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Main authentication routes with signon / signin / signup aliases
router.post("/", authController.login);
router.post("/register", authController.register);
router.post("/signup", authController.register);

router.post("/login", authController.login);
router.post("/signon", authController.login);
router.post("/signin", authController.login);

router.get("/profile", authMiddleware, authController.profile);

module.exports = router;
