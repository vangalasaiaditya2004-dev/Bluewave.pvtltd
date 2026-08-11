# BlueWave Optimizer

BlueWave Optimizer is a beginner-friendly full-stack aquaculture supply chain and inventory management system designed for **BlueWave Aquaculture Pvt. Ltd.**

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router DOM (v7)
- **Styling**: Plain CSS
- **HTTP Client**: Fetch API
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (`sqlite3`)
- **AI Integration**: OpenAI JavaScript SDK (`openai`)
- **Security & Auth**: `bcrypt`, `jsonwebtoken` (JWT), `cors`, `dotenv`

---

## ✨ Features

- **Authentication**: User Signup & Login with password hashing (`bcrypt`) and JWT session security.
- **Real-Time AI Insights**: Database-driven demand analysis, inventory risk warnings, and procurement recommendations powered by OpenAI.
- **Dashboard Overview**: Summary of total inventory items, low-stock warnings, financial valuation, and AI Insights.
- **Inventory Management**: Add and view stock levels, unit costs, categories, and reorder alerts.
- **Supplier Directory**: Manage supplier profiles, emails, phone numbers, and addresses.
- **Demand Forecasts & Purchase Planning**: Automated recommendations based on reorder thresholds.
- **Financial Reports**: Procurement cost and inventory asset summaries.
- **Operations & Admin Views**: Planner Approvals, User Management, Notifications, Audit Logs, and Profile settings.

---

## 📁 Folder Structure

```text
BlueWave-Optimizer/
├── backend/
│   ├── config/          # SQLite database connection & schema initialization
│   ├── controllers/     # API request handlers (auth, inventory, suppliers, reports, ai)
│   ├── database/        # SQLite database file and schema SQL
│   ├── middleware/      # Auth JWT verification and error handlers
│   ├── routes/          # Express route definitions (auth, inventory, suppliers, reports, ai)
│   ├── utils/           # JWT token generator helper
│   ├── app.js           # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Card, Navbar, Sidebar, Table components
│   │   ├── pages/       # Login, Signup, Dashboard, Inventory, Suppliers, Reports, etc.
│   │   ├── services/    # Fetch API service layer
│   │   ├── styles/      # Global CSS stylesheets
│   │   ├── App.jsx      # Main router layout setup
│   │   └── main.jsx     # Application mount point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd BlueWave-Optimizer
```

### 2. Run the Backend
```bash
cd backend
npm install
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 3. Run the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:5173`.

---

## 🤖 How AI Insights Work

1. The frontend dashboard sends an authenticated request to `GET /api/ai/insights`.
2. The backend queries real inventory records, low-stock items, supplier details, and demand forecasts from SQLite.
3. A single structured prompt payload is sent to OpenAI (`gpt-4o-mini`).
4. OpenAI returns structured JSON containing demand insights, inventory risks, procurement recommendations, and risk levels.
5. If `OPENAI_API_KEY` is missing or API limits are reached, the system computes structured data-driven insights locally without crashing.

---

## 🌐 Deployment Instructions

### Backend (Deploy on Render)
1. Create a new **Web Service** on [Render](https://render.com/).
2. Select your repository and set the **Root Directory** to `backend`.
3. Set the **Build Command** to `npm install`.
4. Set the **Start Command** to `npm start`.
5. Add Environment Variables in Render settings:
   - `PORT`: `5000`
   - `JWT_SECRET`: `<your-random-secret-key>`
   - `CORS_ORIGIN`: `<your-deployed-frontend-url>`
   - `OPENAI_API_KEY`: `<your-openai-api-key>`

> [!NOTE]
> Render's default web service filesystem is ephemeral. SQLite will re-initialize on server restarts unless a persistent disk volume is mounted at `/database`.

### Frontend (Deploy on Vercel / Netlify)
1. Import your project into [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).
2. Set the **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Set the Environment Variable:
   - `VITE_API_URL`: `<your-deployed-render-backend-url>/api`

---

## 📦 Git Commands

```bash
git init
git add .
git commit -m "Initial commit - BlueWave Optimizer"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```
