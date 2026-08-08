// Inventory controller:
// Handles basic CRUD operations for inventory items.

const db = require("../config/db");

function hasRequiredInventoryFields(body) {
  return body.name && body.quantity !== undefined && body.unit && body.category_id;
}

function hasValidInventoryNumbers(body) {
  const quantityIsValid = body.quantity === undefined || Number(body.quantity) >= 0;
  const reorderLevelIsValid = body.reorder_level === undefined || Number(body.reorder_level) >= 0;
  const costIsValid = body.cost_per_unit === undefined || Number(body.cost_per_unit) >= 0;

  return quantityIsValid && reorderLevelIsValid && costIsValid;
}

async function getInventory(req, res, next) {
  try {
    const items = await db.all(
      `SELECT inventory.*, categories.name AS category_name
       FROM inventory
       LEFT JOIN categories ON inventory.category_id = categories.id
       ORDER BY inventory.id DESC`
    );

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

async function getInventoryById(req, res, next) {
  try {
    const item = await db.get(
      `SELECT inventory.*, categories.name AS category_name
       FROM inventory
       LEFT JOIN categories ON inventory.category_id = categories.id
       WHERE inventory.id = ?`,
      [req.params.id]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

async function createInventory(req, res, next) {
  try {
    const {
      name,
      category_id,
      quantity,
      unit,
      reorder_level,
      cost_per_unit,
      supplier_id,
    } = req.body;

    if (!hasRequiredInventoryFields(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Name, category_id, quantity, and unit are required",
      });
    }

    if (!hasValidInventoryNumbers(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Quantity, reorder_level, and cost_per_unit cannot be negative",
      });
    }

    const category = await db.get("SELECT * FROM categories WHERE id = ?", [category_id]);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category_id",
      });
    }

    if (supplier_id) {
      const supplier = await db.get("SELECT * FROM suppliers WHERE id = ?", [supplier_id]);

      if (!supplier) {
        return res.status(400).json({
          success: false,
          message: "Invalid supplier_id",
        });
      }
    }

    const result = await db.run(
      `INSERT INTO inventory
       (name, category_id, quantity, unit, reorder_level, cost_per_unit, supplier_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category_id,
        quantity,
        unit,
        reorder_level || 0,
        cost_per_unit || 0,
        supplier_id || null,
      ]
    );

    const item = await db.get("SELECT * FROM inventory WHERE id = ?", [result.id]);

    return res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

async function updateInventory(req, res, next) {
  try {
    const existingItem = await db.get("SELECT * FROM inventory WHERE id = ?", [req.params.id]);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (!hasValidInventoryNumbers(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Quantity, reorder_level, and cost_per_unit cannot be negative",
      });
    }

    if (req.body.category_id) {
      const category = await db.get("SELECT * FROM categories WHERE id = ?", [req.body.category_id]);

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category_id",
        });
      }
    }

    if (req.body.supplier_id) {
      const supplier = await db.get("SELECT * FROM suppliers WHERE id = ?", [req.body.supplier_id]);

      if (!supplier) {
        return res.status(400).json({
          success: false,
          message: "Invalid supplier_id",
        });
      }
    }

    const updatedItem = {
      name: req.body.name || existingItem.name,
      category_id: req.body.category_id || existingItem.category_id,
      quantity: req.body.quantity !== undefined ? req.body.quantity : existingItem.quantity,
      unit: req.body.unit || existingItem.unit,
      reorder_level:
        req.body.reorder_level !== undefined ? req.body.reorder_level : existingItem.reorder_level,
      cost_per_unit:
        req.body.cost_per_unit !== undefined ? req.body.cost_per_unit : existingItem.cost_per_unit,
      supplier_id:
        req.body.supplier_id !== undefined ? req.body.supplier_id : existingItem.supplier_id,
    };

    await db.run(
      `UPDATE inventory
       SET name = ?, category_id = ?, quantity = ?, unit = ?, reorder_level = ?,
           cost_per_unit = ?, supplier_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        updatedItem.name,
        updatedItem.category_id,
        updatedItem.quantity,
        updatedItem.unit,
        updatedItem.reorder_level,
        updatedItem.cost_per_unit,
        updatedItem.supplier_id,
        req.params.id,
      ]
    );

    const item = await db.get("SELECT * FROM inventory WHERE id = ?", [req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteInventory(req, res, next) {
  try {
    const existingItem = await db.get("SELECT * FROM inventory WHERE id = ?", [req.params.id]);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    await db.run("DELETE FROM inventory WHERE id = ?", [req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
};
