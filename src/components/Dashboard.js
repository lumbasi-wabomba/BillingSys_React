import React, { useState } from 'react';
import '../App.css';

// ============================================================
// Icons (plain SVG line icons, no emojis)
// ============================================================
const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconDollar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconTrendingUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ============================================================
// Sample data (swap these for real data once backend is wired up)
// ============================================================

// Section 1 — top overview cards (Total Orders, Total Sales, Average Value, Reservations)
const overviewStats = [
  { icon: <IconCart />, iconBg: '#ede9fe', iconColor: '#7c3aed', value: '6,986', change: '+12.5%', changeType: 'up', label: 'Total Orders' },
  { icon: <IconDollar />, iconBg: '#dbeafe', iconColor: '#2563eb', value: 'KSh 7,516', change: '+12.5%', changeType: 'up', label: 'Total Sales' },
  { icon: <IconTrendingUp />, iconBg: '#fee2e2', iconColor: '#dc2626', value: 'KSh 25.36', change: '-8.5%', changeType: 'down', label: 'Average Value' },
  { icon: <IconCalendar />, iconBg: '#dcfce7', iconColor: '#16a34a', value: '496', change: '+12.5%', changeType: 'up', label: 'Reservations' },
];

// Section 1b — operational alerts (Low Stock, Pending Orders)
const alertStats = [
  { icon: <IconAlertTriangle />, iconBg: '#fef3c7', iconColor: '#d97706', value: '14', change: '+3', changeType: 'down', label: 'Low Stock Items' },
  { icon: <IconClock />, iconBg: '#e0e7ff', iconColor: '#4f46e5', value: '9', change: 'Pending', changeType: 'down', label: 'Pending Orders' },
];

// Section 2 — Top Selling Items (with images)
const topSellingItems = [
  { name: 'Wireless Mouse', unitsSold: 520, image: '/assets/products/mouse.png' },
  { name: 'Bluetooth Speaker', unitsSold: 340, image: '/assets/products/bluetoothspeaker.png' },
  { name: 'Laptop Stand', unitsSold: 275, image: '/assets/products/lapstand.png' },
  { name: 'USB-C Cable', unitsSold: 160, image: '/assets/products/usbcable.png' },
];

// Section 3 — Category statistics
const categoryStats = [
  { category: 'Electronics', count: 420, color: '#3b82f6' },
  { category: 'Accessories', count: 310, color: '#f59e0b' },
  { category: 'Software', count: 150, color: '#10b981' },
  { category: 'Furniture', count: 90, color: '#8b5cf6' },
];

// Section 4 — Staff / user activity (selectable)
const staffActivity = [
  { name: 'Baraka', ordersHandled: 18, salesMade: 'KSh 24,500' },
  { name: 'Evelyn', ordersHandled: 12, salesMade: 'KSh 15,200' },
  { name: 'Lumbasi', ordersHandled: 9, salesMade: 'KSh 11,800' },
];

// Section 5 — Trending products grid (9 items)
const trendingProducts = [
  { name: 'Wireless Mouse', image: '/assets/products/mouse.png' },
  { name: 'Bluetooth Speaker', image: '/assets/products/bluetoothspeaker.png' },
  { name: 'Laptop Stand', image: '/assets/products/lapstand.png' },
  { name: 'USB-C Cable', image: '/assets/products/usbcable.png' },
  { name: 'Mechanical Keyboard', image: '/assets/products/keyboard.png' },
  { name: 'Phone Charger', image: '/assets/products/charger.png' },
  { name: 'HDMI Cable', image: '/assets/products/hdmi.png' },
  { name: 'Power Bank', image: '/assets/products/powerbank.png' },
  { name: 'Webcam', image: '/assets/products/webcam.png' },
];

// ============================================================
// Reusable components
// ============================================================

function StatCard({ icon, iconBg, iconColor, value, change, changeType, label }) {
  return (
    <div style={styles.card}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{value}</span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 12,
            background: changeType === 'up' ? '#dcfce7' : '#fee2e2',
            color: changeType === 'up' ? '#16a34a' : '#dc2626',
          }}>{change}</span>
        </div>
        <div style={{ color: '#6b7280', marginTop: 6, fontSize: 13 }}>{label}</div>
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: '50%',
        background: iconBg, color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon}</div>
    </div>
  );
}

function ProductImageCard({ name, image, subtitle }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: styles.shadow, textAlign: 'center' }}>
      {imgError || !image ? (
        <div style={{
          width: '100%', height: 110, background: '#f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      ) : (
        <img
          src={image}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: 110, objectFit: 'cover' }}
        />
      )}
      <div style={{ padding: '10px 8px' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{name}</div>
        {subtitle && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function CategoryBar({ category, count, max, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
      <span style={{ width: 110, fontSize: 14, color: '#374151' }}>{category}</span>
      <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, margin: '0 12px' }}>
        <div style={{ width: `${(count / max) * 100}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', width: 40, textAlign: 'right' }}>{count}</span>
    </div>
  );
}

function StaffCard({ name, ordersHandled, salesMade, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? '#eef2ff' : '#fff',
        border: isSelected ? '2px solid #6366f1' : '2px solid transparent',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        boxShadow: styles.shadow,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <IconUser />
      </div>
      <div>
        <div style={{ fontWeight: 600, color: '#111827' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>{ordersHandled} active orders</div>
      </div>
    </div>
  );
}

// ============================================================
// Shared styles
// ============================================================
const styles = {
  shadow: '0 1px 3px rgba(0,0,0,0.08)',
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 18,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  section: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: 24,
  },
};

// ============================================================
// Main Dashboard component
// ============================================================
function Dashboard() {
  const [selectedStaff, setSelectedStaff] = useState(staffActivity[0].name);
  const maxCategoryCount = Math.max(...categoryStats.map(c => c.count));
  const activeStaffDetail = staffActivity.find(s => s.name === selectedStaff);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 20px 0' }}>Dashboard</h2>

      {/* ---------- Section 1: Overview stat cards ---------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        {overviewStats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ---------- Section 1b: Low stock / pending orders ---------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        {alertStats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ---------- Section 2: Top Selling Items ---------- */}
      <div style={styles.section}>
        <h3 style={{ marginTop: 0 }}>Top Selling Items</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {topSellingItems.map((p, i) => (
            <ProductImageCard key={i} name={p.name} image={p.image} subtitle={`${p.unitsSold} sold`} />
          ))}
        </div>
      </div>

      {/* ---------- Section 3: Category Statistics ---------- */}
      <div style={styles.section}>
        <h3 style={{ marginTop: 0 }}>Category Statistics</h3>
        {categoryStats.map((c, i) => (
          <CategoryBar key={i} {...c} max={maxCategoryCount} />
        ))}
      </div>

      {/* ---------- Section 4: Active Orders / Staff Activity ---------- */}
      <div style={styles.section}>
        <h3 style={{ marginTop: 0 }}>Active Orders by Staff</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {staffActivity.map((s, i) => (
            <StaffCard
              key={i}
              {...s}
              isSelected={selectedStaff === s.name}
              onClick={() => setSelectedStaff(s.name)}
            />
          ))}
        </div>

        {activeStaffDetail && (
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{activeStaffDetail.name}'s Summary</div>
            <div style={{ fontSize: 14, color: '#374151' }}>
              Active Orders: <strong>{activeStaffDetail.ordersHandled}</strong>
            </div>
            <div style={{ fontSize: 14, color: '#374151' }}>
              Sales Made: <strong>{activeStaffDetail.salesMade}</strong>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Section 5: Trending Products (grid of 9) ---------- */}
      <div style={styles.section}>
        <h3 style={{ marginTop: 0 }}>Trending Products</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {trendingProducts.map((p, i) => (
            <ProductImageCard key={i} name={p.name} image={p.image} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;