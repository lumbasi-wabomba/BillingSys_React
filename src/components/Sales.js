import React, { useState } from 'react';
import '../App.css';

const sales = [
  { id: 1, invoice: 'INV-1001', customer: 'Bob Smith', items: 3, total: 'KSh 5,499', date: '2026-07-01', status: 'Completed' },
  { id: 2, invoice: 'INV-1002', customer: 'Carol Lloyd', items: 1, total: 'KSh 1,299', date: '2026-07-02', status: 'Completed' },
  { id: 3, invoice: 'INV-1003', customer: 'Evelyn Wangi', items: 5, total: 'KSh 9,850', date: '2026-07-03', status: 'Pending' },
  { id: 4, invoice: 'INV-1004', customer: 'Lombardo Reyes', items: 2, total: 'KSh 3,240', date: '2026-07-04', status: 'Completed' },
];

export default function Sales() {
  const [search, setSearch] = useState('');

  const filtered = sales.filter(s =>
    s.invoice.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Sales', value: sales.length },
          { label: 'Completed', value: sales.filter(s => s.status === 'Completed').length },
          { label: 'Pending', value: sales.filter(s => s.status === 'Pending').length },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Sales List</div>
          <div className="table-toolbar">
            <div className="search-box">
              <input placeholder="Search by invoice or customer..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm">+ New Sale</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice</th><th>Customer</th>
              <th className="text-center">Items</th>
              <th className="text-right">Total</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{s.invoice}</td>
                <td style={{ fontSize: 13 }}>{s.customer}</td>
                <td className="text-center">{s.items}</td>
                <td className="text-right" style={{ fontWeight: 700 }}>{s.total}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{s.date}</td>
                <td><span className={`badge badge-${s.status === 'Completed' ? 'success' : 'warning'}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-info">Showing {filtered.length} of {sales.length} sales</div>
        </div>
      </div>
    </div>
  );
}