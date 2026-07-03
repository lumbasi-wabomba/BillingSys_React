import React, { useState } from 'react';
import '../App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const reportStats = [
  { label: 'Total Sales', value: '$284,500', change: '+14.2%', up: true, color: 'orange' },
  { label: 'Total Purchase', value: '$142,800', change: '+6.5%', up: true, color: 'blue' },
  { label: 'Gross Profit', value: '$141,700', change: '+22.1%', up: true, color: 'green' },
  { label: 'Net Loss', value: '$12,400', change: '-3.4%', up: false, color: 'red' },
  { label: 'Total Returns', value: '$8,250', change: '+1.1%', up: false, color: 'purple' },
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

const ChartComponent = () => {
  // Generate monthly sales and purchase data from June
  const chartData = [
    { month: 'Jun 24', sales: 5600, purchase: 9200 },
    { month: 'Jun 25', sales: 1520, purchase: 12500 },
    { month: 'Jun 26', sales: 650, purchase: 3400 },
    { month: 'Jun 27', sales: 3200, purchase: 7800 },
    { month: 'Jun 28', sales: 890, purchase: 0 },
    { month: 'Jun 29', sales: 2450, purchase: 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f8" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 4 }}
          formatter={(value) => `$${value}`}
        />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#ff6b35" strokeWidth={2.5} dot={{ fill: '#ff6b35', r: 3 }} name="Sales" />
        <Line type="monotone" dataKey="purchase" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} name="Purchase" />
      </LineChart>
    </ResponsiveContainer>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {reportStats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header">
              <div className={`stat-icon ${s.color}`}></div>
              <span className={`stat-badge ${s.up ? 'badge-up' : 'badge-down'}`}>{s.change}</span>
            </div>
            <div className="stat-value" style={{ fontSize: 18 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="chart-card mb-4">
        <div className="chart-header">
          <div className="chart-title">Revenue Overview — 2026</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="date" className="filter-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" className="filter-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <button className="btn btn-primary btn-sm">Apply</button>
          </div>
        </div>
        <ChartComponent />
      </div>

      <div className="tab-bar">
        {[['sales', 'Sales Report'], ['purchase', 'Purchase Report'], ['returns', 'Returns']].map(([id, label]) => (
          <div key={id} className={`tab ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
            {label}
          </div>
        ))}
      </div>

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
            <div style={{ fontSize: 48, marginBottom: 12 }}></div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>No Returns in Date Range</div>
            <div style={{ fontSize: 13 }}>Adjust the date filters to see returns data</div>
          </div>
        </div>
      )}
    </div>
  );
}
