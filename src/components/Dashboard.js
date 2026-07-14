import React, { useState, useEffect } from "react";
import { getProductIcon } from "../utils/iconMapper";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3001/api";

// ---- Component ----

export default function Dashboard() {
  const [statCards, setStatCards] = useState([]);
  const [secondaryCards, setSecondaryCards] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [staffActivity, setStaffActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJson = (url) =>
      fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} from ${url}`);
        return r.json();
      });

    Promise.all([
      fetchJson(`${API_BASE_URL}/products`),
      fetchJson(`${API_BASE_URL}/invoices`),
      fetchJson(`${API_BASE_URL}/customers`),
    ])
      .then(([products, invoices, customers]) => {
        const productsArray = Array.isArray(products) ? products : [];
        const invoicesArray = Array.isArray(invoices) ? invoices : [];
        const customersArray = Array.isArray(customers) ? customers : [];

        const totalSales = invoicesArray.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
        const avgValue = invoicesArray.length > 0 ? totalSales / invoicesArray.length : 0;
        const lowStockCount = productsArray.filter(p => 
          Number(p.quantity || 0) <= Number(p.minQty || 0)
        ).length;

        // Set primary stat cards
        setStatCards([
          {
            id: "orders",
            label: "Total Orders",
            value: invoicesArray.length.toString(),
            delta: "+12.5%",
            deltaTone: "positive",
            icon: ShoppingCart,
            iconBg: "#EDE9FE",
            iconColor: "#7C3AED",
          },
          {
            id: "sales",
            label: "Total Sales",
            value: `KSh ${Number(totalSales || 0).toLocaleString()}`,
            delta: "+12.5%",
            deltaTone: "positive",
            icon: DollarSign,
            iconBg: "#DBEAFE",
            iconColor: "#2563EB",
          },
          {
            id: "avg",
            label: "Average Value",
            value: `KSh ${Number(avgValue || 0).toLocaleString()}`,
            delta: "-8.5%",
            deltaTone: "negative",
            icon: TrendingUp,
            iconBg: "#FEE2E2",
            iconColor: "#DC2626",
          },
          {
            id: "customers",
            label: "Total Customers",
            value: customersArray.length.toString(),
            delta: "+12.5%",
            deltaTone: "positive",
            icon: Calendar,
            iconBg: "#D1FAE5",
            iconColor: "#059669",
          },
        ]);

        // Set secondary stat cards
        setSecondaryCards([
          {
            id: "lowstock",
            label: "Low Stock Items",
            value: lowStockCount.toString(),
            delta: "+3",
            deltaTone: "negative",
            icon: AlertTriangle,
            iconBg: "#FEF3C7",
            iconColor: "#D97706",
          },
          {
            id: "pending",
            label: "Total Products",
            value: productsArray.length.toString(),
            delta: "Products",
            deltaTone: "negative",
            icon: Clock,
            iconBg: "#E0E7FF",
            iconColor: "#4F46E5",
          },
        ]);

        setTopSellingItems(productsArray.slice(0, 4).map(p => ({
          name: p.name,
          sold: Math.floor(Math.random() * 500) + 100, 
          image: getProductIcon(p.category)
        })));

        const categories = {};
        productsArray.forEach(p => {
          const cat = p.category || "Other";
          categories[cat] = (categories[cat] || 0) + 1;
        });
        const colors = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];
        setCategoryStats(
          Object.entries(categories).slice(0, 4).map(([name, value], idx) => ({
            name,
            value,
            color: colors[idx % colors.length]
          }))
        );

        // Trending products
        setTrendingProducts(productsArray.slice(0, 9).map(p => ({
          name: p.name,
          image: getProductIcon(p.category)
        })));

        // Mock staff activity
        setStaffActivity([
          { name: "Baraka", activeOrders: Math.floor(Math.random() * 20) + 5, salesMade: `KSh ${Math.floor(Math.random() * 30000) + 10000}` },
          { name: "Evelyn", activeOrders: Math.floor(Math.random() * 20) + 5, salesMade: `KSh ${Math.floor(Math.random() * 30000) + 10000}` },
          { name: "Lumbasi", activeOrders: Math.floor(Math.random() * 20) + 5, salesMade: `KSh ${Math.floor(Math.random() * 30000) + 10000}` },
        ]);
        setSelectedStaff("Baraka");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h3>Loading dashboard...</h3>;
  }

  const maxCategoryValue = categoryStats.length > 0 ? Math.max(...categoryStats.map((c) => c.value)) : 1;
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