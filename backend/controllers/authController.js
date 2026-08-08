// Authentication controller:
// Handles user registration, login, and profile viewing.

const bcrypt = require("bcrypt");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

async function register(req, res, next) {
  try {
    const { name, email, password, role_id } = req.body;

    // Check required fields before touching the database.
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role_id are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const role = await db.get("SELECT * FROM roles WHERE id = ?", [role_id]);

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Invalid role_id",
      });
    }

    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash the password before saving it.
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role_id]
    );

    const newUser = await db.get(
      `SELECT users.id, users.name, users.email, users.role_id, roles.name AS role
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.id = ?`,
      [result.id]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const user = await db.get(
      `SELECT users.*, roles.name AS role
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.email = ?`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function profile(req, res, next) {
  try {
    const user = await db.get(
      `SELECT users.id, users.name, users.email, users.role_id, roles.name AS role
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  profile,
};
