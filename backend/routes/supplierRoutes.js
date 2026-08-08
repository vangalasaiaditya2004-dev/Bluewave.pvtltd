// Supplier routes.

const express = require("express");
const supplierController = require("../controllers/supplierController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All supplier routes are protected with JWT authentication.
router.get("/", authMiddleware, supplierController.getSuppliers);
router.get("/:id", authMiddleware, supplierController.getSupplierById);
router.post("/", authMiddleware, supplierController.createSupplier);
router.put("/:id", authMiddleware, supplierController.updateSupplier);
router.delete("/:id", authMiddleware, supplierController.deleteSupplier);

module.exports = router;
