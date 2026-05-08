# Subscription Management Dashboard

A full-stack SaaS admin dashboard built with **React.js**, **Node.js + Express**, and **MongoDB**. Users can subscribe to plans, view their active subscription, and manage their profile. Admins can monitor all subscriptions and view revenue stats.
 
---

## 📑 Table of Contents

- [Live Deployment](#live-deployment)
- [Project Structure](#️-project-structure)
- [Features Implemented](#-features-implemented)
  - [Backend Features](#backend)
  - [Frontend Features](#frontend)
  - [Bonus Features](#bonus-features)
- [Setup & Running the Project](#-setup--running-the-project)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#-backend-setup)
  - [Frontend Setup](#-frontend-setup)
- [Demo Credentials](#-demo-credentials)
- [API Endpoints Reference](#-api-endpoints-reference)
  - [Auth APIs](#auth)
  - [Plans APIs](#plans)
  - [Subscriptions APIs](#subscriptions)
- [Frontend Pages](#-frontend-pages)
- [Database Schema](#️-database-schema)
- [Tech Stack](#️-tech-stack)
- [Troubleshooting](#-troubleshooting)
- [Quick Start (Run Both)](#-running-both-simultaneously-quick-start)
- [Why I’m a Strong Fit for This Role](#why-im-a-strong-fit-for-this-role)
- [Candidate Information](#candidate-information)

--- 

## Live Deployment

The application is live and deployed on Render

### Access the Application
- **Live App:** https://subscriptionmanager-2.onrender.com

### Deployment Details
- Frontend is deployed as a **Static Site**
- Backend is deployed as a **Web Service**
- Continuous deployment is enabled, so every push to the respective branch triggers an automatic redeployment.

### Production Setup
- Environment variables are securely managed in :contentReference[oaicite:2]{index=2}
- Frontend and backend are maintained in a **monorepo** structure for streamlined deployment and version management

---

## 🗂️ Project Structure

```
subscription-dashboard/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # DB connection, JWT utils
│   │   ├── controllers/      # Route handler logic
│   │   ├── middleware/        # Auth, error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routers
│   │   ├── seeds/            # Database seeder
│   │   ├── validators/       # Joi validation schemas
│   │   └── index.js          # App entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React + Vite + Tailwind
    ├── src/
    │   ├── api/              # Axios instance + API calls
    │   ├── components/       # Navbar, ProtectedRoute
    │   ├── context/          # AuthContext, ThemeContext
    │   ├── pages/            # Login, Register, Plans, Dashboard, Admin
    │   ├── App.jsx           # Routes
    │   └── main.jsx          # Entry point
    ├── .env.example
    └── package.json
```

---

## ✅ Features Implemented

### Backend
- JWT Authentication with **Access Tokens** (15 min) + **Refresh Tokens** (7 days)
- Automatic **silent token refresh** via Axios interceptors
- Role-based access control (`user`, `admin`)
- MongoDB collections: `users`, `plans`, `subscriptions`
- Joi **validation** on all payloads
- Structured **error handling** with status codes
- Database **seeder** with 4 realistic plans + demo users

### Frontend
- `/login` — User login with demo credentials hint
- `/register` — User registration with client-side validation
- `/plans` — Responsive plan cards with **simulated payment modal**
- `/dashboard` — Active subscription details, progress bar, cancel option
- `/admin/subscriptions` — Admin table with stats, filters, pagination
- **Dark / Light theme toggle** (persisted to localStorage)
- Auto-logout on token expiry
- Protected routes by role

### Bonus Features
- ✅ Simulated payment modal (like Stripe/Razorpay UX)
- ✅ Dark/Light theme toggle
- ✅ Plan upgrade/downgrade logic (replaces existing active subscription)

---

## 🚀 Setup & Running the Project

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| npm | v9 or higher | Comes with Node.js |
| MongoDB | v6 or higher | https://www.mongodb.com/try/download/community |

> **MongoDB must be running locally** on the default port `27017`.  
> Start it with: `mongod` (or via MongoDB Compass / as a service)

---

## 🔧 Backend Setup

### Step 1: Navigate to the backend folder

```bash
cd subscription-dashboard/backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create the `.env` file

Copy the example env file and fill in values:

```bash
cp .env.example .env
```

Open `.env` and update if needed (defaults should work for local dev):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/subscription_dashboard
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

> ⚠️ Change the JWT secrets to long random strings in production!

### Step 4: Seed the database

This creates 4 sample plans and 2 demo users:

```bash
npm run seed
```

You should see:

```
✅ MongoDB Connected: localhost
🗑️  Cleared existing plans
✅ Inserted 4 plans
✅ Created admin user: admin@demo.com / admin123
✅ Created demo user: user@demo.com / user1234
🌱 Database seeded successfully!
```

### Step 5: Start the backend server

**Development mode** (auto-restarts on file changes):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend runs at: **http://localhost:5000**

Test it's working:
```bash
curl http://localhost:5000/api/health
# Should return: {"success":true,"message":"Server is running!"}
```

---

## 🎨 Frontend Setup

Open a **new terminal window** (keep the backend running).

### Step 1: Navigate to the frontend folder

```bash
cd subscription-dashboard/frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create the `.env` file

```bash
cp .env.example .env
```

The default `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

> This points to your local backend. Leave it as-is for local development.

### Step 4: Start the frontend dev server

```bash
npm run dev
```

The frontend runs at: **http://localhost:5173**

Open your browser at **http://localhost:5173** 🎉

---

## 🔑 Demo Credentials

After seeding, use these to log in:

| Role | Email | Password |
|------|-------|----------|
| 👤 Regular User | user@demo.com | user1234 |
| 🛡️ Admin | admin@demo.com | admin123 |

---

## 📡 API Endpoints Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get tokens |
| POST | `/api/auth/refresh-token` | Public | Refresh access token |
| POST | `/api/auth/logout` | Private | Logout user |
| GET | `/api/auth/me` | Private | Get current user |

### Plans

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/plans` | Public | Get all active plans |
| GET | `/api/plans/:id` | Public | Get single plan |

### Subscriptions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/subscribe/:planId` | User/Admin | Subscribe to a plan |
| GET | `/api/my-subscription` | User/Admin | Get my active subscription |
| PUT | `/api/my-subscription/cancel` | User/Admin | Cancel subscription |
| GET | `/api/admin/subscriptions` | Admin only | All subscriptions |
| GET | `/api/admin/stats` | Admin only | Revenue & count stats |

### Example API calls

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com", "password": "pass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@demo.com", "password": "user1234"}'
```

**Get plans:**
```bash
curl http://localhost:5000/api/plans
```

**Subscribe to a plan** (replace `TOKEN` and `PLAN_ID`):
```bash
curl -X POST http://localhost:5000/api/subscribe/PLAN_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🌐 Frontend Pages

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public (redirects if logged in) |
| Register | `/register` | Public (redirects if logged in) |
| Plans | `/plans` | Public |
| Dashboard | `/dashboard` | Authenticated users |
| Admin Dashboard | `/admin/subscriptions` | Admin only |

---

## 🗃️ Database Schema

### `plans` collection
```js
{
  name: String,          // "Free", "Starter", "Pro", "Enterprise"
  price: Number,         // Monthly price in USD
  features: [String],    // Array of feature descriptions
  duration: Number,      // Duration in days (e.g., 30)
  isActive: Boolean
}
```

### `users` collection
```js
{
  name: String,
  email: String,         // Unique
  password: String,      // Bcrypt hashed
  role: "user" | "admin",
  refreshToken: String   // Stored for validation
}
```

### `subscriptions` collection
```js
{
  user_id: ObjectId,     // Ref to User
  plan_id: ObjectId,     // Ref to Plan
  start_date: Date,
  end_date: Date,
  status: "active" | "expired" | "cancelled",
  paymentStatus: "paid" | "pending" | "failed",
  transactionId: String  // Simulated (e.g., TXN_A1B2C3D4...)
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS v3 |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ORM | Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Joi |
| HTTP Client | Axios (with interceptors) |
| Build Tool | Vite |
| Dev Server | Nodemon |

---

## ❓ Troubleshooting

**MongoDB connection fails:**
- Make sure MongoDB is running: `mongod --dbpath /data/db`
- Or start via system service: `sudo systemctl start mongod`

**Port already in use:**
- Change `PORT` in backend `.env` (e.g., `PORT=5001`)
- Update `VITE_API_URL` in frontend `.env` accordingly

**CORS error in browser:**
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default allows `http://localhost:5173`

**Token errors after seeding:**
- Clear browser localStorage: Open DevTools → Application → Local Storage → Clear
- Log in again

---

## 📁 Running Both Simultaneously (Quick Start)

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd subscription-dashboard/backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd subscription-dashboard/frontend
npm install
cp .env.example .env
npm run dev
```

Then open: **http://localhost:5173** 🚀

---

## Why I’m a Strong Fit for This Role

This project reflects how I approach software engineering: not just completing assigned requirements, but delivering a production-ready product with scalability, usability, and maintainability in mind.

### What I Delivered Beyond Core Requirements

Along with the required features, I implemented additional enhancements to improve the product experience:

✅ Simulated payment integration  
✅ Dark / Light theme toggle  
✅ Plan upgrade & downgrade workflow  
✅ Full-stack deployment (Frontend + Backend)  
✅ Production-ready environment configuration  
✅ Responsive and user-friendly UI  

### What This Demonstrates 

- **Problem Solving Mindset**  

- **Clean and Maintainable Code**  

- **Production Thinking**  

- **Adaptability & Learning Speed** 

### My Engineering Approach

I believe good software is built with:

- Clean architecture  
- Scalability in mind  
- User-centric thinking  
- Strong debugging ability  
- Fast learning capability  
- Ownership and accountability  

This project represents the kind of contribution I aim to bring to a team: delivering reliable products, solving real problems, and continuously improving systems.

---

## Candidate Information

**Name:** Sanjai Kumar R
**Location:** Chennai

### Contact

* **Email:** [sanjaikumar451@gmail.com](mailto:sanjaikumar451@gmail.com)
* **Phone:** +91 6369417210
* **GitHub:** [https://github.com/Sanjai451](https://github.com/Sanjai451/)
* **LinkedIn:** [https://www.linkedin.com/in/sanjaikumarr451](https://www.linkedin.com/in/sanjaikumarr451)
* **Portfolio:** [https://sanjaikumarr.vercel.app](https://sanjaikumarr.vercel.app/)

### Availability

Open to full-time opportunities in Full Stack Development, Backend Development, and Software Engineering.

### Final Note

Thank you for reviewing this project.
