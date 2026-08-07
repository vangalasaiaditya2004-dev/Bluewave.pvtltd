// Report controller:
// Provides simple reports using SQLite SELECT queries.

const db = require("../config/db");

async function getFinancialReports(req, res, next) {
  try {
    const reports = await db.all("SELECT * FROM financial_reports ORDER BY report_date DESC");

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
}

async function getInventoryReports(req, res, next) {
  try {
    const totalItems = await db.get("SELECT COUNT(*) AS count FROM inventory");
    const lowStockItems = await db.all(
      `SELECT *
       FROM inventory
       WHERE quantity <= reorder_level
       ORDER BY quantity ASC`
    );
    const totalValue = await db.get(
      "SELECT SUM(quantity * cost_per_unit) AS value FROM inventory"
    );

    return res.status(200).json({
      success: true,
      data: {
        total_items: totalItems.count,
        low_stock_items: lowStockItems,
        total_inventory_value: totalValue.value || 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getDemandForecastReports(req, res, next) {
  try {
    const forecasts = await db.all(
      `SELECT demand_forecasts.*, inventory.name AS inventory_name
       FROM demand_forecasts
       LEFT JOIN inventory ON demand_forecasts.inventory_id = inventory.id
       ORDER BY forecast_date DESC`
    );

    return res.status(200).json({
      success: true,
      data: forecasts,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFinancialReports,
  getInventoryReports,
  getDemandForecastReports,
};
