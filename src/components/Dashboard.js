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
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <div className="dash-breadcrumb">Home / Dashboard</div>
        </div>
        <div className="dash-welcome">Welcome, Wayne</div>
      </div>

      {/* Primary stat cards */}
      <div className="dash-stat-grid">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Secondary stat cards (Low Stock / Pending) */}
      <div className="dash-stat-grid dash-stat-grid-secondary">
        {secondaryCards.map((card) => (
          <StatCard key={card.id} {...card} wide />
        ))}
      </div>

      {/* Top Selling Items */}
      <section className="dash-panel">
        <h2 className="dash-panel-title">Top Selling Items</h2>
        <div className="dash-product-grid dash-four-col">
          {topSellingItems.map((item) => (
            <div className="dash-product-card" key={item.name}>
              <div className="dash-product-image-wrap">
                <img src={item.image} alt={item.name} className="dash-product-image" />
              </div>
              <div className="dash-product-name">{item.name}</div>
              <div className="dash-product-sub">{item.sold} sold</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Statistics */}
      <section className="dash-panel">
        <h2 className="dash-panel-title">Category Statistics</h2>
        <div className="dash-category-list">
          {categoryStats.map((cat) => (
            <div className="dash-category-row" key={cat.name}>
              <div className="dash-category-name">{cat.name}</div>
              <div className="dash-category-bar-track">
                <div
                  className="dash-category-bar-fill"
                  style={{
                    width: `${(cat.value / maxCategoryValue) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <div className="dash-category-value">{cat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Orders by Staff */}
      <section className="dash-panel">
        <h2 className="dash-panel-title">Active Orders by Staff</h2>
        <div className="dash-staff-grid">
          {staffActivity.map((staff) => (
            <button
              key={staff.name}
              className={`dash-staff-card ${
                selectedStaff === staff.name ? "dash-staff-card-selected" : ""
              }`}
              onClick={() => setSelectedStaff(staff.name)}
              type="button"
            >
              <div className="dash-staff-avatar">
                <User size={20} />
              </div>
              <div>
                <div className="dash-staff-name">{staff.name}</div>
                <div className="dash-staff-sub">{staff.activeOrders} active orders</div>
              </div>
            </button>
          ))}
        </div>

        {activeStaff && (
          <div className="dash-staff-summary">
            <div className="dash-staff-summary-title">{activeStaff.name}'s Summary</div>
            <div className="dash-staff-summary-row">
              Active Orders: <strong>{activeStaff.activeOrders}</strong>
            </div>
            <div className="dash-staff-summary-row">
              Sales Made: <strong>{activeStaff.salesMade}</strong>
            </div>
          </div>
        )}
      </section>

      {/* Trending Products */}
      <section className="dash-panel">
        <h2 className="dash-panel-title">Trending Products</h2>
        <div className="dash-product-grid dash-three-col">
          {trendingProducts.map((item) => (
            <div className="dash-product-card" key={item.name}>
              <div className="dash-product-image-wrap dash-tall">
                <img src={item.image} alt={item.name} className="dash-product-image" />
              </div>
              <div className="dash-product-name">{item.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, delta, deltaTone, icon: Icon, iconBg, iconColor, wide }) {
  return (
    <div className={`dash-stat-card ${wide ? "dash-stat-card-wide" : ""}`}>
      <div className="dash-stat-card-top">
        <div className="dash-stat-value">{value}</div>
        <span className={`dash-stat-delta dash-stat-delta-${deltaTone}`}>{delta}</span>
        <div className="dash-stat-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="dash-stat-label">{label}</div>
    </div>
  );
}