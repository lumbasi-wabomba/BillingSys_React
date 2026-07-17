# BillSystem — Electronics Shop Billing System

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Automated-2496ED?logo=docker)
![GitHub Actions](https://img.shields.io/badge/GitHub_CI/CD-Passing-2088FF?logo=githubactions)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render)

A full-stack **Point-of-Sale (POS) and Inventory Management** application built for electronics retail shops. The frontend is a React 19 single-page application with a sidebar-driven navigation system, and the backend is an Express.js REST API that connects to a Neon (PostgreSQL) database. The project is containerized with Docker and deployed via a GitHub Actions CI/CD pipeline to Render.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Frontend Architecture (React)](#frontend-architecture-react)
- [Backend Overview](#backend-overview)
- [Features](#features)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Getting Started Locally](#getting-started-locally)
- [Project Structure](#project-structure)

---

## Tech Stack

| Layer        | Technology                                                |
|--------------|-----------------------------------------------------------|
| **Frontend** | React 19, React Router DOM 7, Redux Toolkit, Recharts     |
| **Backend**  | Express.js 5, PostgreSQL (`pg`), CORS                     |
| **Database** | Neon (PostgreSQL cloud)                                   |
| **Icons**    | Lucide React + custom PNG icons                           |
| **Container**| Docker + Nginx (production multi-stage build)            |
| **CI/CD**    | GitHub Actions → Docker Hub → Render auto-deploy          |

---

## Frontend Architecture (React)

This is a **single-page application (SPA)** bootstrapped with Create React App. Navigation is managed in-memory via React state — there is no traditional URL-based routing.

### Entry Point

- **`src/index.js`** — Renders `<App />` inside `React.StrictMode`.

### App Shell

- **`src/App.js`** — The root component holds a `activePage` state and renders:
  - `<Sidebar />` — left navigation panel
  - `<TopBar />` — top header bar
  - `<renderPage />` — swaps page content based on `activePage`

### Navigation System

The **`<Sidebar />`** component defines all navigation items in a structured array with section headers:

```
Main
├── Dashboard
Inventory
├── Products
├── Stock Reconciliation
├── Stock Transfer
Sales
├── Sales
├── Sales Returns
├── POS
Purchases
├── Purchase
├── Expenses
People
├── Customers
├── Suppliers
├── Users
Analytics
├── Invoices
├── Reports
System
├── Settings
```

Each sidebar item has an associated **PNG icon** from `src/icons/`. The active page is highlighted with an `active` CSS class.

### Page Components (18 pages)

| Component                 | File                           | Description                              |
|--------------------------|--------------------------------|------------------------------------------|
| `Dashboard`              | `src/components/Dashboard.js`  | Sales stats, top-selling items, categories, staff activity, trending products |
| `Products`               | `src/components/Products.js`   | Product list with drill-down             |
| `ProductDetail`          | `src/components/ProductDetail.js` | Single product view                    |
| `AddProduct`             | `src/components/AddProduct.js` | Create new product                       |
| `StockReconciliation`    | `src/components/StockReconciliation.js` | Count and adjust stock        |
| `StockTransfer`          | `src/components/StockTransfer.js` | Transfer stock between locations     |
| `Sales`                  | `src/components/Sales.js`      | Sales transactions                      |
| `SalesReturns`           | `src/components/SalesReturns.js` | Return and refund management         |
| `POS`                    | `src/components/POS.js`        | Point-of-Sale checkout interface        |
| `Invoice`                | `src/components/Invoice.js`    | Generate new invoice                    |
| `InvoiceHistory`         | `src/components/InvoiceHistory.js` | View past invoices                  |
| `Purchase`               | `src/components/Purchase.js`   | Purchase order creation                 |
| `Expenses`               | `src/components/Expenses.js`   | Track business expenses                 |
| `Customers`              | `src/components/Customers.js`  | Customer directory                      |
| `AddCustomer`            | `src/components/AddCustomer.js` | Add new customer                       |
| `Suppliers`              | `src/components/Suppliers.js`  | Supplier directory                      |
| `AddSupplier`            | `src/components/AddSupplier.js` | Add new supplier                       |
| `Users`                  | `src/components/Users.js`      | Staff user management                   |
| `AddUser`                | `src/components/AddUser.js`    | Add new staff user                      |
| `Reports`                | `src/components/Reports.js`    | Analytics and reporting                 |

### Dashboard Deep Dive

The **Dashboard** fetches data from four API endpoints on mount:

- `GET /api/products` — products list
- `GET /api/invoices` — all invoices
- `GET /api/customers` — customer records
- `GET /api/users` — staff users

It derives these visual cards/sections:

| Section                  | Data Source                        |
|--------------------------|------------------------------------|
| Total Orders             | Invoice count                      |
| Total Sales              | Sum of invoice totals              |
| Average Order Value      | Total Sales ÷ Invoice count        |
| Total Customers          | Customer count                     |
| Low Stock Items          | Products where qty ≤ minQty        |
| Total Products           | Product count                      |
| Top Selling Items        | First 4 products with random "sold" counts |
| Category Statistics      | Grouped bar chart by product category |
| Active Orders by Staff   | Per-staff summary from users list  |
| Trending Products        | First 9 products                   |

**Utility**: `src/utils/iconMapper.js` maps product categories to icons for display throughout the app.

### State Management

The project includes **Redux Toolkit** (`@reduxjs/toolkit` + `react-redux`) in the dependencies, though the current implementation uses local React `useState` for page navigation. Redux is available for future state expansion (e.g., cart management, authenticated user session).

### Styling

All styling lives in **`src/App.css`** — a single global stylesheet. The UI uses a sidebar + topbar layout with colored stat cards and responsive grids.

---

## ⚙️ Backend Overview

The backend lives in the **`backend/`** directory and is a separate Express.js 5 server.

### API Server (`backend/dbServer.js`)

Runs on **port 3001** with CORS enabled. It mounts six REST resource routers:

| Route                 | File                     |
|-----------------------|--------------------------|
| `/api/products`       | `backend/Products.js`    |
| `/api/expenses`       | `backend/Expense.js`     |
| `/api/invoices`       | `backend/Invoice.js`     |
| `/api/sales`          | `backend/Sales.js`       |
| `/api/suppliers`      | `backend/Suppliers.js`   |
| `/api/users`          | `backend/Users.js`       |
| `/api/customers`      | `backend/Customer.js`    |
| `/api/purchases`      | `backend/Purchase.js`    |

### Database Connection (`backend/db.js`)

Connects to **Neon PostgreSQL** using the `pg` library with SSL:

```js
const db = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
});
```

The same connection module also exists at **`src/dbConn.js`** for direct database access from the frontend build process if needed.

### Schema (`backend/schema.txt`)

Contains the full PostgreSQL schema definition for all tables: products, customers, suppliers, users, invoices, sales, expenses, purchases, and more.

---

## Features

- ✅ **Dashboard** — Real-time KPIs, sales metrics, category breakdown, staff activity, trending products
- ✅ **Product Management** — Add, edit, delete, detail view, low-stock alerts
- ✅ **Stock Control** — Full reconciliation and stock transfer between locations
- ✅ **Point of Sale (POS)** — Intuitive checkout interface
- ✅ **Sales & Returns** — Track all sales transactions and handle returns/refunds
- ✅ **Invoicing** — Generate and browse invoice history
- ✅ **Purchasing** — Purchase order management
- ✅ **Expense Tracking** — Log and monitor business expenses
- ✅ **People Management** — Customers, suppliers, and staff users CRUD
- ✅ **Reports** — Sales and inventory analytics
- ✅ **Containerized** — Docker image served via Nginx for production
- ✅ **CI/CD** — Automated build → push → deploy pipeline

---

## CI/CD Pipeline

The project uses **GitHub Actions** to automate deployment:

```
Push to main branch
       │
       ▼
GitHub Action: Build and Push Docker Image
       │
       ├── Checkout code
       ├── Log in to Docker Hub (using secrets)
       ├── Build Docker image
       │     ├── ARG DOCKER_ENV_FILE passed as secret
       │     ├── Node 24 build stage → npm install → npm run build
       │     └── Nginx production stage (serves static build)
       ├── Push image to Docker Hub
       │     └── {username}/billingsys-react:latest
       │
       ▼
Render (auto-deploy triggered by Docker Hub webhook)
       └── Runs the latest image, serving the React app on port 80
```

**File**: `.github/workflows/docker-image.yml`

The multi-stage **Dockerfile**:
1. **Stage 1 (build)**: Node 24 — installs deps, builds the React app
2. **Stage 2 (production)**: `nginx:stable-alpine` — serves the built static files on port 80

Environment variables (for API endpoints, database config, etc.) are injected via a secret `DOCKER_ENV_FILE` build argument that gets written to `/app/docker.env` at build time.

---

## Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Neon PostgreSQL Database
PGHOST=your-neon-host.neon.tech
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-db-name
PGSSLMODE=require
# sslmode: set to 'require' for Neon
```

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ (or 24+ matching Docker build)
- A Neon PostgreSQL database (free tier works)
- Git

### 1. Clone and install

```bash
git clone https://github.com/lumbasi-wabomba/BillingSys_React.git
cd BillingSys_React

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set environment variables

Create a `.env` file in the project root with your Neon connection details (see [Environment Variables](#environment-variables)).

### 3. Start the backend

```bash
cd backend
node dbServer.js
# Server running on port 3001
```

### 4. Start the frontend (in a separate terminal)

```bash
cd BillingSys_React
npm start
# Opens http://localhost:3000
```

The React dev server proxies API calls to `http://localhost:3001/api/*`.

### 5. Build for production

```bash
npm run build
```

### 6. Run with Docker

```bash
docker build -t billingsys-react .
docker run -p 80:80 billingsys-react
```

---

## Project Structure

```
BillingSys_React/
├── .dockerignore
├── .gitignore
├── Dockerfile                     # Multi-stage: Node 24 build → Nginx serve
├── package.json                   # React 19 + dependencies
├── package-lock.json
├── README.md
│
├── .github/
│   └── workflows/
│       ├── docker-image.yml       # GitHub Actions CI/CD pipeline
│       ├── Dockerfile              # (alt Dockerfile for CI)
│       ├── docker.env              # Environment file template for CI
│       └── .dockerignore
│
├── backend/                       # Express.js REST API
│   ├── package.json
│   ├── db.js                      # Neon PostgreSQL connection
│   ├── dbServer.js                # Express server (port 3001)
│   ├── schema.txt                 # Full DB schema
│   ├── Customer.js                # /api/customers router
│   ├── Expense.js                 # /api/expenses router
│   ├── Invoice.js                 # /api/invoices router
│   ├── Products.js                # /api/products router
│   ├── Purchase.js                # /api/purchases router
│   ├── Sales.js                   # /api/sales router
│   ├── Suppliers.js               # /api/suppliers router
│   └── Users.js                   # /api/users router
│
├── public/                        # Static assets served by React
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   ├── logo192.png
│   ├── logo512.png
│   └── assets/
│       └── products/              # Product placeholder images
│           ├── bluetoothspeaker.png
│           ├── charger.png
│           ├── hdmi.png
│           ├── keyboard.png
│           ├── lapstand.png
│           ├── mouse.png
│           ├── powerbank.png
│           ├── usbcable.png
│           └── webcam.png
│
├── src/                           # React frontend source
│   ├── index.js                   # App entry point
│   ├── App.js                     # Root component (state-based routing)
│   ├── App.css                    # Global stylesheet
│   ├── App.test.js
│   ├── index.css
│   ├── dbConn.js                  # DB connection (same as backend/db.js)
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   │
│   ├── components/                # All page & UI components
│   │   ├── Sidebar.js             # Left navigation panel
│   │   ├── TopBar.js              # Top header bar
│   │   ├── Dashboard.js           # Main KPIs overview
│   │   ├── Products.js            # Product list
│   │   ├── ProductDetail.js       # Single product detail view
│   │   ├── AddProduct.js          # Create product form
│   │   ├── StockReconciliation.js # Stock count & adjustment
│   │   ├── StockTransfer.js       # Transfer stock
│   │   ├── Sales.js               # Sales transactions
│   │   ├── SalesReturns.js        # Sales returns
│   │   ├── POS.js                 # Point of Sale checkout
│   │   ├── Invoice.js             # Create invoice
│   │   ├── InvoiceHistory.js      # Invoice archive
│   │   ├── Purchase.js            # Purchase orders
│   │   ├── Expenses.js            # Expense tracking
│   │   ├── Customers.js           # Customer directory
│   │   ├── AddCustomer.js         # Add customer form
│   │   ├── Suppliers.js           # Supplier directory
│   │   ├── AddSupplier.js         # Add supplier form
│   │   ├── Users.js               # Staff user management
│   │   ├── AddUser.js             # Add user form
│   │   └── Reports.js             # Analytics reports
│   │
│   ├── icons/                     # Custom PNG icons for sidebar
│   │   ├── customers.png
│   │   ├── dashboard.png
│   │   ├── expense.png
│   │   ├── invoice.webp
│   │   ├── products.png
│   │   ├── purchases.png
│   │   ├── report.png
│   │   ├── return.png
│   │   ├── sales.png
│   │   ├── search.png
│   │   ├── settings.png
│   │   ├── stock.png
│   │   ├── supplier.png
│   │   ├── transfer.png
│   │   └── user.png
│   │
│   └── utils/
│       └── iconMapper.js          # Maps product categories to icons
│
└── (no .env file — create your own from the Environment Variables section)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with passion by:
    [lumbasi wabomba](https://github.com/lumbasi-wabomba)
    [evaline mwangi](https://github.com/Evaline-Mwangi)
    [wayne baraka](https://github.com/wmukhaga)
    [prince mumo](https://github.com/pr-i-nce)