import React, { useState } from 'react';
import '../App.css';

const returnsData = [
  { id: 1, invoice: 'INV-1001', customer: 'Bob Smith', item: 'Bluetooth Speaker', reason: 'Defective', refund: 'KSh 49.99', date: '2026-07-02', status: 'Approved' },
  { id: 2, invoice: 'INV-1003', customer: 'Evelyn Wangi', item: 'USB-C Cable', reason: 'Wrong item', refund: 'KSh 9.99', date: '2026-07-04', status: 'Pending' },
];

export default function SalesReturns() {
  const [search, setSearch] = useState('');

  const filtered = returnsData.filter(r =>
    r.invoice.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Returns', value: returnsData.length },
          { label: 'Approved', value: returnsData.filter(r => r.status === 'Approved').length },
          { label: 'Pending', value: returnsData.filter(r => r.status === 'Pending').length },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Sales Returns</div>
          <div className="table-toolbar">
            <div className="search-box">
              <input placeholder="Search by invoice or customer..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm">+ New Return</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Invoice</th><th>Customer</th><th>Item</th><th>Reason</th><th className="text-right">Refund</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{r.invoice}</td>
                <td style={{ fontSize: 13 }}>{r.customer}</td>
                <td style={{ fontSize: 13 }}>{r.item}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{r.reason}</td>
                <td className="text-right" style={{ fontWeight: 700 }}>{r.refund}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{r.date}</td>
                <td><span className={`badge badge-${r.status === 'Approved' ? 'success' : 'warning'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-info">Showing {filtered.length} of {returnsData.length} returns</div>
        </div>
      </div>
    </div>
  );
}