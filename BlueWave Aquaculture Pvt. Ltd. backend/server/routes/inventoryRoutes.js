// Inventory routes.

const express = require("express");
const inventoryController = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All inventory routes are protected with JWT authentication.
router.get("/", authMiddleware, inventoryController.getInventory);
router.get("/:id", authMiddleware, inventoryController.getInventoryById);
router.post("/", authMiddleware, inventoryController.createInventory);
router.put("/:id", authMiddleware, inventoryController.updateInventory);
router.delete("/:id", authMiddleware, inventoryController.deleteInventory);

module.exports = router;
