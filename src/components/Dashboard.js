import React, { useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react";

// ---- Mock data (swap these for real data from dbConn.js / your API) ----

const statCards = [
  {
    id: "orders",
    label: "Total Orders",
    value: "6,986",
    delta: "+12.5%",
    deltaTone: "positive",
    icon: ShoppingCart,
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
  {
    id: "sales",
    label: "Total Sales",
    value: "KSh 7,516",
    delta: "+12.5%",
    deltaTone: "positive",
    icon: DollarSign,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    id: "avg",
    label: "Average Value",
    value: "KSh 25.36",
    delta: "-8.5%",
    deltaTone: "negative",
    icon: TrendingUp,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
  },
  {
    id: "reservations",
    label: "Reservations",
    value: "496",
    delta: "+12.5%",
    deltaTone: "positive",
    icon: Calendar,
    iconBg: "#D1FAE5",
    iconColor: "#059669",
  },
];

const secondaryCards = [
  {
    id: "lowstock",
    label: "Low Stock Items",
    value: "14",
    delta: "+3",
    deltaTone: "negative",
    icon: AlertTriangle,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    id: "pending",
    label: "Pending Orders",
    value: "9",
    delta: "Pending",
    deltaTone: "negative",
    icon: Clock,
    iconBg: "#E0E7FF",
    iconColor: "#4F46E5",
  },
];

const topSellingItems = [
  { name: "Wireless Mouse", sold: 520, image: "/assets/products/mouse.png" },
  {
    name: "Bluetooth Speaker",
    sold: 340,
    image: "/assets/products/bluetoothspeaker.png",
  },
  { name: "Laptop Stand", sold: 275, image: "/assets/products/lapstand.png" },
  { name: "USB-C Cable", sold: 160, image: "/assets/products/usbcable.png" },
];

const trendingProducts = [
  { name: "Wireless Mouse", image: "/assets/products/mouse.png" },
  { name: "Bluetooth Speaker", image: "/assets/products/bluetoothspeaker.png" },
  { name: "Laptop Stand", image: "/assets/products/lapstand.png" },
  { name: "USB-C Cable", image: "/assets/products/usbcable.png" },
  { name: "Mechanical Keyboard", image: "/assets/products/keyboard.png" },
  { name: "Phone Charger", image: "/assets/products/charger.png" },
  { name: "HDMI Cable", image: "/assets/products/hdmi.png" },
  { name: "Power Bank", image: "/assets/products/powerbank.png" },
  { name: "Webcam", image: "/assets/products/webcam.png" },
];

const categoryStats = [
  { name: "Electronics", value: 420, color: "#3B82F6" },
  { name: "Accessories", value: 310, color: "#F59E0B" },
  { name: "Software", value: 150, color: "#10B981" },
  { name: "Furniture", value: 90, color: "#8B5CF6" },
];

const staffActivity = [
  { name: "Baraka", activeOrders: 18, salesMade: "KSh 24,500" },
  { name: "Evelyn", activeOrders: 12, salesMade: "KSh 15,200" },
  { name: "Lumbasi", activeOrders: 9, salesMade: "KSh 11,800" },
];

// ---- Component ----

export default function Dashboard() {
  const [selectedStaff, setSelectedStaff] = useState(staffActivity[0].name);
  const maxCategoryValue = Math.max(...categoryStats.map((c) => c.value));
  const activeStaff = staffActivity.find((s) => s.name === selectedStaff);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="breadcrumb">Home / Dashboard</div>
        </div>
        <div className="welcome-text">Welcome, Wayne</div>
      </div>

      {/* Primary stat cards */}
      <div className="stat-grid">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Secondary stat cards (Low Stock / Pending) */}
      <div className="stat-grid secondary">
        {secondaryCards.map((card) => (
          <StatCard key={card.id} {...card} wide />
        ))}
      </div>

      {/* Top Selling Items */}
      <section className="panel">
        <h2 className="panel-title">Top Selling Items</h2>
        <div className="product-grid four-col">
          {topSellingItems.map((item) => (
            <div className="product-card" key={item.name}>
              <div className="product-image-wrap">
                <img src={item.image} alt={item.name} className="product-image" />
              </div>
              <div className="product-name">{item.name}</div>
              <div className="product-sub">{item.sold} sold</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Statistics */}
      <section className="panel">
        <h2 className="panel-title">Category Statistics</h2>
        <div className="category-list">
          {categoryStats.map((cat) => (
            <div className="category-row" key={cat.name}>
              <div className="category-name">{cat.name}</div>
              <div className="category-bar-track">
                <div
                  className="category-bar-fill"
                  style={{
                    width: `${(cat.value / maxCategoryValue) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <div className="category-value">{cat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Orders by Staff */}
      <section className="panel">
        <h2 className="panel-title">Active Orders by Staff</h2>
        <div className="staff-grid">
          {staffActivity.map((staff) => (
            <button
              key={staff.name}
              className={`staff-card ${
                selectedStaff === staff.name ? "staff-card-selected" : ""
              }`}
              onClick={() => setSelectedStaff(staff.name)}
              type="button"
            >
              <div className="staff-avatar">
                <User size={20} />
              </div>
              <div>
                <div className="staff-name">{staff.name}</div>
                <div className="staff-sub">{staff.activeOrders} active orders</div>
              </div>
            </button>
          ))}
        </div>

        {activeStaff && (
          <div className="staff-summary">
            <div className="staff-summary-title">{activeStaff.name}'s Summary</div>
            <div className="staff-summary-row">
              Active Orders: <strong>{activeStaff.activeOrders}</strong>
            </div>
            <div className="staff-summary-row">
              Sales Made: <strong>{activeStaff.salesMade}</strong>
            </div>
          </div>
        )}
      </section>

      {/* Trending Products */}
      <section className="panel">
        <h2 className="panel-title">Trending Products</h2>
        <div className="product-grid three-col">
          {trendingProducts.map((item) => (
            <div className="product-card" key={item.name}>
              <div className="product-image-wrap tall">
                <img src={item.image} alt={item.name} className="product-image" />
              </div>
              <div className="product-name">{item.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, delta, deltaTone, icon: Icon, iconBg, iconColor, wide }) {
  return (
    <div className={`stat-card ${wide ? "stat-card-wide" : ""}`}>
      <div className="stat-card-top">
        <div className="stat-value">{value}</div>
        <span className={`stat-delta stat-delta-${deltaTone}`}>{delta}</span>
        <div className="stat-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}