// Supplier controller:
// Handles basic CRUD operations for supplier records.

const db = require("../config/db");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getSuppliers(req, res, next) {
  try {
    const suppliers = await db.all("SELECT * FROM suppliers ORDER BY id DESC");

    return res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
}

async function getSupplierById(req, res, next) {
  try {
    const supplier = await db.get("SELECT * FROM suppliers WHERE id = ?", [req.params.id]);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
}

async function createSupplier(req, res, next) {
  try {
    const { name, contact_person, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Supplier name and email are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid supplier email address",
      });
    }

    const existingSupplier = await db.get("SELECT * FROM suppliers WHERE email = ?", [email]);

    if (existingSupplier) {
      return res.status(409).json({
        success: false,
        message: "Supplier email already exists",
      });
    }

    const result = await db.run(
      `INSERT INTO suppliers (name, contact_person, email, phone, address)
       VALUES (?, ?, ?, ?, ?)`,
      [name, contact_person || null, email, phone || null, address || null]
    );

    const supplier = await db.get("SELECT * FROM suppliers WHERE id = ?", [result.id]);

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
}

async function updateSupplier(req, res, next) {
  try {
    const supplier = await db.get("SELECT * FROM suppliers WHERE id = ?", [req.params.id]);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    const updatedSupplier = {
      name: req.body.name || supplier.name,
      contact_person:
        req.body.contact_person !== undefined ? req.body.contact_person : supplier.contact_person,
      email: req.body.email || supplier.email,
      phone: req.body.phone !== undefined ? req.body.phone : supplier.phone,
      address: req.body.address !== undefined ? req.body.address : supplier.address,
    };

    if (!isValidEmail(updatedSupplier.email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid supplier email address",
      });
    }

    const emailOwner = await db.get("SELECT * FROM suppliers WHERE email = ? AND id != ?", [
      updatedSupplier.email,
      req.params.id,
    ]);

    if (emailOwner) {
      return res.status(409).json({
        success: false,
        message: "Supplier email already exists",
      });
    }

    await db.run(
      `UPDATE suppliers
       SET name = ?, contact_person = ?, email = ?, phone = ?, address = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        updatedSupplier.name,
        updatedSupplier.contact_person,
        updatedSupplier.email,
        updatedSupplier.phone,
        updatedSupplier.address,
        req.params.id,
      ]
    );

    const savedSupplier = await db.get("SELECT * FROM suppliers WHERE id = ?", [req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: savedSupplier,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteSupplier(req, res, next) {
  try {
    const supplier = await db.get("SELECT * FROM suppliers WHERE id = ?", [req.params.id]);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    await db.run("DELETE FROM suppliers WHERE id = ?", [req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
