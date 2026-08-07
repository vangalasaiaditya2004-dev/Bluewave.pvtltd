// Simple API service using the browser Fetch API.
// This connects the React app to the Node.js backend running on port 5000.

// In production, the frontend can use a deployed backend URL.
// If none is provided, the app uses a same-origin /api path.
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function login({ email, password }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.data) {
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  return data;
}

async function signup({ fullName, email, password, role_id }) {
  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: fullName,
      email,
      password,
      role_id,
    }),
  });

  if (data.data) {
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  return data;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

async function getProfile() {
  const data = await request("/api/auth/profile");
  localStorage.setItem("user", JSON.stringify(data.data));
  return data;
}

async function fetchDashboard() {
  const data = await request("/api/reports/inventory");
  return data.data;
}

export default {
  login,
  signup,
  logout,
  getUser,
  getProfile,
  fetchDashboard,
};
