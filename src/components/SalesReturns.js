import React, { useState, useEffect } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:3001/api';

export default function SalesReturns() {
  const [returnsData, setReturnsData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch returns/exchange data (this endpoint may need to be created in backend)
    // For now, we can fetch invoices and filter for returns
    fetch(`${API_BASE_URL}/invoices`)
      .then(res => res.json())
      .then(data => {
        // Mock returns data from invoices - would need a dedicated returns endpoint
        const returns = Array.isArray(data) ? data.slice(0, 2).map((inv, idx) => ({
          id: idx + 1,
          invoice: `INV-${inv.id?.slice(0, 4).toUpperCase() || idx + 1001}`,
          customer: inv.customer_name || 'Unknown',
          item: 'Product', // Would need product info from API
          reason: idx === 0 ? 'Defective' : 'Wrong item',
          refund: `KSh ${Number(inv.total || 0).toLocaleString()}`,
          date: new Date(inv.i_date).toISOString().split('T')[0],
          status: idx === 0 ? 'Approved' : 'Pending'
        })) : [];
        setReturnsData(returns);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setReturnsData([]);
        setLoading(false);
      });
  }, []);

  const filtered = returnsData.filter(r =>
    r.invoice.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h3>Loading sales returns...</h3>;
  }

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