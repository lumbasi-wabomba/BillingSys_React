import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../App.css';

// --- Simple inline SVG icons ---
const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconReceipt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2z" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconDollar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconReturn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-9.36L1 10" />
  </svg>
);

const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconTruck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// --- Sample data (replace with real data from your backend later) ---
const stats = [
  { icon: <IconBox />, iconBg: '#f3e8ff', iconColor: '#9333ea', value: '1,240', change: '+12.5%', changeType: 'up', label: 'Total Products' },
  { icon: <IconReceipt />, iconBg: '#dbeafe', iconColor: '#2563eb', value: '532', change: '+8.2%', changeType: 'up', label: 'Total Sales' },
  { icon: <IconDollar />, iconBg: '#fef3c7', iconColor: '#d97706', value: '$25,360', change: '+15.4%', changeType: 'up', label: 'Total Revenue' },
  { icon: <IconReturn />, iconBg: '#fee2e2', iconColor: '#dc2626', value: '18', change: '-3.1%', changeType: 'down', label: 'Sales Returns' },
  { icon: <IconCart />, iconBg: '#dcfce7', iconColor: '#16a34a', value: '210', change: '+6.7%', changeType: 'up', label: 'Purchases' },
  { icon: <IconCard />, iconBg: '#ffe4e6', iconColor: '#e11d48', value: '$4,120', change: '+2.3%', changeType: 'up', label: 'Expenses' },
  { icon: <IconUsers />, iconBg: '#e0f2fe', iconColor: '#0284c7', value: '312', change: '+4.5%', changeType: 'up', label: 'Customers' },
  { icon: <IconTruck />, iconBg: '#ede9fe', iconColor: '#7c3aed', value: '48', change: '+1.2%', changeType: 'up', label: 'Suppliers' },
];

const revenueData = [
  { day: 'Mon', revenue: 3200 },
  { day: 'Tue', revenue: 2100 },
  { day: 'Wed', revenue: 3900 },
  { day: 'Thu', revenue: 2800 },
  { day: 'Fri', revenue: 4100 },
  { day: 'Sat', revenue: 3600 },
  { day: 'Sun', revenue: 3000 },
];

const topProducts = [
  { rank: 1, name: 'Wireless Mouse', count: 520, color: '#3b82f6' },
  { rank: 2, name: 'USB-C Cable', count: 340, color: '#f59e0b' },
  { rank: 3, name: 'Bluetooth Speaker', count: 275, color: '#10b981' },
  { rank: 4, name: 'Laptop Stand', count: 160, color: '#8b5cf6' },
];

// --- Stat card component ---
function StatCard({ icon, iconBg, iconColor, value, change, changeType, label }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{value}</span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 12,
            background: changeType === 'up' ? '#dcfce7' : '#fee2e2',
            color: changeType === 'up' ? '#16a34a' : '#dc2626',
          }}>{change}</span>
        </div>
        <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{label}</div>
      </div>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: iconBg,
        color: iconColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>{icon}</div>
    </div>
  );
}

// --- Top product row with progress bar ---
function TopItemRow({ rank, name, count, max, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0' }}>
      <span style={{ width: 30, fontWeight: 600, color: '#6b7280', fontSize: 13 }}>#{rank}</span>
      <span style={{ flex: 1, fontSize: 14 }}>{name}</span>
      <div style={{ width: 100, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 12px' }}>
        <div style={{
          width: `${(count / max) * 100}%`,
          height: '100%',
          background: color,
          borderRadius: 3,
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{count}</span>
    </div>
  );
}

function Dashboard() {
  const maxCount = Math.max(...topProducts.map(p => p.count));

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
      </div>

      {/* Stat cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 24,
      }}>
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Chart + Top items */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Total Revenue (Weekly)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Top Selling Products</h3>
          {topProducts.map(p => (
            <TopItemRow key={p.rank} {...p} max={maxCount} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;