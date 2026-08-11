// Simple API service using the browser Fetch API.
// This connects the React app to the Node.js backend running on port 5000.

// In production, the frontend can use a deployed backend URL.
// Normalize base URL so that it always targets the /api namespace
const rawApiUrl = (import.meta.env.VITE_API_URL || "/api").trim().replace(/\/$/, "");
const API_BASE_URL = rawApiUrl ? (rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`) : "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath.startsWith("/api/")) {
    normalizedPath = normalizedPath.replace(/^\/api/, "");
  }

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  } else {
    const rawText = await response.text().catch(() => "");
    const isHtml = rawText.includes("<!DOCTYPE") || rawText.includes("<html");
    const msg = isHtml
      ? "Unable to reach backend API. Please check your VITE_API_URL or server deployment."
      : (rawText || "Request failed");
    data = { message: msg };
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired or unauthorized. Please log in again.");
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

async function login({ email, password }) {
  const data = await request("/auth/login", {
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
  const data = await request("/auth/register", {
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
  const data = await request("/auth/profile");
  localStorage.setItem("user", JSON.stringify(data.data));
  return data;
}

async function fetchDashboard() {
  const data = await request("/reports/inventory");
  return data.data;
}

async function fetchInventory() {
  const data = await request("/inventory");
  return data.data || [];
}

async function createInventoryItem(payload) {
  const data = await request("/inventory", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data.data;
}

async function fetchSuppliers() {
  const data = await request("/suppliers");
  return data.data || [];
}

async function createSupplier(payload) {
  const data = await request("/suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data.data;
}

async function fetchDemandForecasts() {
  const data = await request("/reports/demand-forecasts");
  return data.data || [];
}

async function fetchFinancialReports() {
  const data = await request("/reports/financial");
  return data.data || [];
}

async function fetchAIInsights() {
  const data = await request("/ai/insights");
  return data.data;
}

const api = {
  login,
  signon: login,
  signin: login,
  signup,
  register: signup,
  logout,
  getUser,
  getProfile,
  fetchDashboard,
  fetchInventory,
  createInventoryItem,
  fetchSuppliers,
  createSupplier,
  fetchDemandForecasts,
  fetchFinancialReports,
  fetchAIInsights,
};

export default api;
