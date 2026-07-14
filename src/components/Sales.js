import React, { useState, useEffect } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:3001/api';

const formatCurrency = (value) =>
  `KSh ${Number(value || 0).toLocaleString()}`;

const mapInvoice = (invoice) => ({
  id: invoice.id,
  invoice: `INV-${invoice.id?.slice(0, 8).toUpperCase() || 'UNKNOWN'}`,
  customer: invoice.customer_name || 'Unknown',
  items: invoice.items_count || 0,
  total: formatCurrency(invoice.total || 0),
  date: new Date(invoice.i_date).toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
  status: invoice.status || 'Completed',
});

export default function Sales({ navigate }) {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/invoices`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map(mapInvoice)
          : [];
        setSales(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSales([]);
        setLoading(false);
      });
  }, []);

  const filtered = sales.filter(s =>
    s.invoice.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h3>Loading sales...</h3>;
  }

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
            <button className="btn btn-primary btn-sm" onClick={() => navigate && navigate('invoice')}>+ New Sale</button>
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