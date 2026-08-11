// This file creates and exports the SQLite database connection.
// SQLite stores the full database in one file: database/bluewave.db.

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Build paths safely so they work on Windows, macOS, Linux, and Vercel Serverless (/tmp).
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const databaseDir = isServerless ? "/tmp" : path.join(__dirname, "..", "database");
const databasePath = path.join(databaseDir, "bluewave.db");
const schemaPath = path.join(__dirname, "..", "database", "schema.sql");

// Make sure the database folder exists before opening the file.
try {
  fs.mkdirSync(databaseDir, { recursive: true });
} catch (err) {
  console.warn("Could not create database dir, using fallback /tmp:", err.message);
}

// Open the SQLite database. If bluewave.db does not exist, sqlite3 creates it.
const sqliteConnection = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
  } else {
    console.log("SQLite database connected");
  }
});

// Load and run schema.sql when the app starts.
// CREATE TABLE IF NOT EXISTS keeps this safe to run many times.
const fallbackSchema = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, role_id INTEGER NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (role_id) REFERENCES roles(id));
CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS suppliers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, contact_person TEXT, email TEXT NOT NULL UNIQUE, phone TEXT, address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category_id INTEGER NOT NULL, quantity REAL NOT NULL DEFAULT 0, unit TEXT NOT NULL, reorder_level REAL NOT NULL DEFAULT 0, cost_per_unit REAL NOT NULL DEFAULT 0, supplier_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (category_id) REFERENCES categories(id), FOREIGN KEY (supplier_id) REFERENCES suppliers(id));
CREATE TABLE IF NOT EXISTS purchase_orders (id INTEGER PRIMARY KEY AUTOINCREMENT, supplier_id INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'Pending', total_amount REAL NOT NULL DEFAULT 0, order_date DATETIME DEFAULT CURRENT_TIMESTAMP, expected_delivery_date DATETIME, created_by INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (supplier_id) REFERENCES suppliers(id), FOREIGN KEY (created_by) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS purchase_order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, purchase_order_id INTEGER NOT NULL, inventory_id INTEGER NOT NULL, quantity REAL NOT NULL, unit_price REAL NOT NULL, total_price REAL NOT NULL, FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id), FOREIGN KEY (inventory_id) REFERENCES inventory(id));
CREATE TABLE IF NOT EXISTS demand_forecasts (id INTEGER PRIMARY KEY AUTOINCREMENT, inventory_id INTEGER NOT NULL, forecast_date DATE NOT NULL, predicted_demand REAL NOT NULL, confidence_score REAL DEFAULT 0, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (inventory_id) REFERENCES inventory(id));
CREATE TABLE IF NOT EXISTS financial_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, report_date DATE NOT NULL, total_procurement_cost REAL NOT NULL DEFAULT 0, inventory_value REAL NOT NULL DEFAULT 0, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT NOT NULL, message TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, action TEXT NOT NULL, table_name TEXT, record_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));
INSERT OR IGNORE INTO roles (id, name) VALUES (1, 'Procurement Manager'), (2, 'Inventory Planner'), (3, 'Warehouse User'), (4, 'Supplier'), (5, 'Finance Reviewer');
INSERT OR IGNORE INTO categories (id, name, description) VALUES (1, 'Fish Feed', 'Feed and nutrition products'), (2, 'Medicine', 'Health and treatment products'), (3, 'Equipment', 'Aquaculture tools and equipment');
`;

const schema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, "utf8") : fallbackSchema;

// ready lets app.js wait until tables and seed data are ready before listening.
const ready = new Promise((resolve, reject) => {
  sqliteConnection.exec(schema, (error) => {
    if (error) {
      console.error("Database schema setup failed:", error.message);
      reject(error);
    } else {
      console.log("Database schema ready");
      resolve();
    }
  });
});

// db.run is used for INSERT, UPDATE, and DELETE.
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteConnection.run(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        // lastID and changes are useful after INSERT/UPDATE/DELETE.
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// db.get returns one row.
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteConnection.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

// db.all returns many rows.
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteConnection.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  ready,
  run,
  get,
  all,
};
