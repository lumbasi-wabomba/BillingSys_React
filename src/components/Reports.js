// import React from "react";

// function SaleCard(){
//   return(
   

//   );
// };

// function RevenueCard() {
//   return ();
// };

// function TopSellingProducts(){
//   return();
// };

// function LowStockProducts(){
//   return();
// };

// function ResentSales(){
//   return();
// };

// function SalesStaticsChart() {
//   return ();
// };

// function RecentTransactions() {
//   return();
// }:

// export default function Dashboard() {
//   return (
//     <>
//       <div className="salesStats">
//         <SalesStaticsChart />
//         <RecentTransactions />
//       </div>

//       <div className="">
//         <TopSellingProducts />
//         <LowStockProducts />
//         <RecentSales />
//       </div>
//     </>
//   );
// }


import React, { useState } from 'react';
import '../App.css';

const reportStats = [
  { label: 'Total Sales', value: '$284,500', change: '+14.2%', up: true, icon: '💰', color: 'orange' },
  { label: 'Total Purchase', value: '$142,800', change: '+6.5%', up: true, icon: '🧾', color: 'blue' },
  { label: 'Gross Profit', value: '$141,700', change: '+22.1%', up: true, icon: '📈', color: 'green' },
  { label: 'Net Loss', value: '$12,400', change: '-3.4%', up: false, icon: '📉', color: 'red' },
  { label: 'Total Returns', value: '$8,250', change: '+1.1%', up: false, icon: '↩️', color: 'purple' },
];

const salesData = [
  { ref: 'SR-2026-001', date: 'Jun 29, 2026', customer: 'Alice Johnson', warehouse: 'Main Store', biller: 'Wayne M.', grandTotal: '$2,450', paid: '$2,450', due: '$0.00', status: 'Completed', payStatus: 'Paid' },
  { ref: 'SR-2026-002', date: 'Jun 28, 2026', customer: 'Bob Smith', warehouse: 'Branch A', biller: 'Sarah K.', grandTotal: '$890', paid: '$500', due: '$390', status: 'Completed', payStatus: 'Partial' },
  { ref: 'SR-2026-003', date: 'Jun 27, 2026', customer: 'Carol White', warehouse: 'Main Store', biller: 'Wayne M.', grandTotal: '$3,200', paid: '$3,200', due: '$0.00', status: 'Processing', payStatus: 'Paid' },
  { ref: 'SR-2026-004', date: 'Jun 26, 2026', customer: 'David Green', warehouse: 'Branch B', biller: 'Tom P.', grandTotal: '$650', paid: '$0', due: '$650', status: 'Pending', payStatus: 'Unpaid' },
  { ref: 'SR-2026-005', date: 'Jun 25, 2026', customer: 'Eva Brown', warehouse: 'Main Store', biller: 'Wayne M.', grandTotal: '$1,100', paid: '$1,100', due: '$0.00', status: 'Completed', payStatus: 'Paid' },
  { ref: 'SR-2026-006', date: 'Jun 25, 2026', customer: 'Frank Lee', warehouse: 'Branch A', biller: 'Sarah K.', grandTotal: '$420', paid: '$420', due: '$0.00', status: 'Completed', payStatus: 'Paid' },
  { ref: 'SR-2026-007', date: 'Jun 24, 2026', customer: 'Grace Kim', warehouse: 'Main Store', biller: 'Tom P.', grandTotal: '$5,600', paid: '$2,800', due: '$2,800', status: 'Completed', payStatus: 'Partial' },
];

const purchaseData = [
  { ref: 'PO-2026-101', date: 'Jun 28, 2026', supplier: 'Tech Supplies Co.', warehouse: 'Main Store', grandTotal: '$12,500', paid: '$12,500', due: '$0', status: 'Received' },
  { ref: 'PO-2026-102', date: 'Jun 27, 2026', supplier: 'Global Goods Ltd.', warehouse: 'Branch A', grandTotal: '$7,800', paid: '$5,000', due: '$2,800', status: 'Partial' },
  { ref: 'PO-2026-103', date: 'Jun 26, 2026', supplier: 'Prime Distribution', warehouse: 'Main Store', grandTotal: '$3,400', paid: '$3,400', due: '$0', status: 'Received' },
  { ref: 'PO-2026-104', date: 'Jun 25, 2026', supplier: 'Quick Supply Inc.', warehouse: 'Branch B', grandTotal: '$9,200', paid: '$0', due: '$9,200', status: 'Pending' },
];

const LineChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesPts = [30, 55, 40, 78, 60, 92, 70, 85, 65, 90, 75, 100];
  const purchPts = [20, 35, 28, 50, 40, 60, 48, 58, 45, 62, 55, 70];
  const w = 520, h = 150, padX = 20, padY = 10;
  const pts = (data) => data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * (w - 2 * padX);
    const y = h - padY - (v / 100) * (h - 2 * padY);
    return `${x},${y}`;
  }).join(' ');
  const toPath = (data, color) => {
    const points = data.map((v, i) => {
      const x = padX + (i / (data.length - 1)) * (w - 2 * padX);
      const y = h - padY - (v / 100) * (h - 2 * padY);
      return [x, y];
    });
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = (points[i - 1][0] + points[i][0]) / 2;
      d += ` C ${cp1x} ${points[i-1][1]}, ${cp1x} ${points[i][1]}, ${points[i][0]} ${points[i][1]}`;
    }
    return d;
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        {[['Sales', '#ff6b35'], ['Purchase', '#3b82f6']].map(([l, c]) => (
          <span key={l} style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 24, height: 2, background: c, display: 'inline-block', borderRadius: 1 }}></span>{l}
          </span>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h + 20}`}>
        {[25, 50, 75, 100].map(v => (
          <line key={v} x1={padX} x2={w - padX} y1={h - padY - (v / 100) * (h - 2 * padY)} y2={h - padY - (v / 100) * (h - 2 * padY)} stroke="#f3f4f8" strokeWidth="1" />
        ))}
        <path d={toPath(salesPts)} fill="none" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round" />
        <path d={toPath(purchPts)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        {salesPts.map((v, i) => {
          const x = padX + (i / (salesPts.length - 1)) * (w - 2 * padX);
          const y = h - padY - (v / 100) * (h - 2 * padY);
          return <circle key={i} cx={x} cy={y} r="3" fill="#ff6b35" stroke="white" strokeWidth="1.5" />;
        })}
        {months.map((m, i) => (
          <text key={i} x={padX + (i / (months.length - 1)) * (w - 2 * padX)} y={h + 16} textAnchor="middle" fontSize="10" fill="#9ca3af">{m}</text>
        ))}
      </svg>
    </div>
  );
};

const payColor = (s) => s === 'Paid' ? 'success' : s === 'Partial' ? 'warning' : 'danger';
const statusColor = (s) => s === 'Completed' || s === 'Received' ? 'success' : s === 'Processing' || s === 'Partial' ? 'info' : 'warning';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-06-29');

  return (
    <div>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {reportStats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header">
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <span className={`stat-badge ${s.up ? 'badge-up' : 'badge-down'}`}>{s.change}</span>
            </div>
            <div className="stat-value" style={{ fontSize: 18 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-card mb-4">
        <div className="chart-header">
          <div className="chart-title">Revenue Overview — 2026</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="date" className="filter-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" className="filter-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <button className="btn btn-primary btn-sm">Apply</button>
          </div>
        </div>
        <LineChart />
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[['sales', '🛒 Sales Report'], ['purchase', '🧾 Purchase Report'], ['returns', '↩️ Returns']].map(([id, label]) => (
          <div key={id} className={`tab ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
            {label}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar mb-4">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search by reference, customer..." />
        </div>
        <select className="filter-select"><option>All Warehouses</option><option>Main Store</option><option>Branch A</option><option>Branch B</option></select>
        <select className="filter-select"><option>All Status</option><option>Completed</option><option>Pending</option><option>Processing</option></select>
        <select className="filter-select"><option>All Payment</option><option>Paid</option><option>Partial</option><option>Unpaid</option></select>
        <button className="btn btn-outline btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
        <button className="btn btn-outline btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print
        </button>
      </div>

      {/* Table */}
      {activeTab === 'sales' && (
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">Sales Report</div>
            <span style={{ fontSize: 13, color: '#6b7280' }}>Showing 7 of 248 records</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ref No.</th><th>Date</th><th>Customer</th><th>Warehouse</th>
                <th>Biller</th><th className="text-right">Grand Total</th>
                <th className="text-right">Paid</th><th className="text-right">Due</th>
                <th>Status</th><th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: '#ff6b35', fontWeight: 600 }}>{r.ref}</td>
                  <td>{r.date}</td>
                  <td>{r.customer}</td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{r.warehouse}</td>
                  <td>{r.biller}</td>
                  <td className="text-right" style={{ fontWeight: 700 }}>{r.grandTotal}</td>
                  <td className="text-right" style={{ color: '#10b981', fontWeight: 600 }}>{r.paid}</td>
                  <td className="text-right" style={{ color: r.due === '$0.00' || r.due === '$0' ? '#6b7280' : '#ef4444', fontWeight: 600 }}>{r.due}</td>
                  <td><span className={`badge badge-${statusColor(r.status)}`}>{r.status}</span></td>
                  <td><span className={`badge badge-${payColor(r.payStatus)}`}>{r.payStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <div className="pagination-info">Showing 1-7 of 248 entries</div>
            <div className="pagination-btns">
              {['‹', '1', '2', '3', '...', '35', '›'].map((p, i) => (
                <button key={i} className={`page-btn ${p === '1' ? 'active' : ''}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'purchase' && (
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">Purchase Report</div>
            <span style={{ fontSize: 13, color: '#6b7280' }}>Showing 4 of 124 records</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ref No.</th><th>Date</th><th>Supplier</th><th>Warehouse</th>
                <th className="text-right">Grand Total</th><th className="text-right">Paid</th>
                <th className="text-right">Due</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: '#3b82f6', fontWeight: 600 }}>{r.ref}</td>
                  <td>{r.date}</td>
                  <td>{r.supplier}</td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{r.warehouse}</td>
                  <td className="text-right" style={{ fontWeight: 700 }}>{r.grandTotal}</td>
                  <td className="text-right" style={{ color: '#10b981', fontWeight: 600 }}>{r.paid}</td>
                  <td className="text-right" style={{ color: r.due === '$0' ? '#6b7280' : '#ef4444', fontWeight: 600 }}>{r.due}</td>
                  <td><span className={`badge badge-${statusColor(r.status)}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <div className="pagination-info">Showing 1-4 of 124 entries</div>
            <div className="pagination-btns">
              {['‹', '1', '2', '3', '›'].map((p, i) => (
                <button key={i} className={`page-btn ${p === '1' ? 'active' : ''}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'returns' && (
        <div className="table-card">
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>↩️</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>No Returns in Date Range</div>
            <div style={{ fontSize: 13 }}>Adjust the date filters to see returns data</div>
          </div>
        </div>
      )}
    </div>
  );
}
