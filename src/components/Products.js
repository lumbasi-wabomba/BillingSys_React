import React, { useState } from 'react';
import '../App.css';

export const products = [
  { id: 1, name: 'Apple iPhone 15 Pro Max', sku: 'PHN-001', category: 'Electronics', brand: 'Apple', unit: 'Piece', price: '$1,299', purchasePrice: '$950', qty: 45, minQty: 10, warehouse: 'Main Store', status: 'Active', icon: '📱' },
  { id: 2, name: 'Dell XPS 15 Laptop (32GB)', sku: 'LPT-042', category: 'Electronics', brand: 'Dell', unit: 'Piece', price: '$2,199', purchasePrice: '$1,700', qty: 12, minQty: 5, warehouse: 'Main Store', status: 'Active', icon: '💻' },
  { id: 3, name: 'Samsung 55" QLED TV', sku: 'TV-007', category: 'Electronics', brand: 'Samsung', unit: 'Piece', price: '$1,099', purchasePrice: '$780', qty: 8, minQty: 5, warehouse: 'Branch A', status: 'Active', icon: '📺' },
  { id: 4, name: 'Sony WH-1000XM5 Headphones', sku: 'AUD-022', category: 'Electronics', brand: 'Sony', unit: 'Piece', price: '$399', purchasePrice: '$280', qty: 32, minQty: 10, warehouse: 'Main Store', status: 'Active', icon: '🎧' },
  { id: 5, name: 'Logitech MX Master 3 Mouse', sku: 'ACC-089', category: 'Accessories', brand: 'Logitech', unit: 'Piece', price: '$129', purchasePrice: '$85', qty: 3, minQty: 15, warehouse: 'Main Store', status: 'Low Stock', icon: '🖱️' },
  { id: 6, name: 'Apple Watch Series 9', sku: 'WTC-015', category: 'Electronics', brand: 'Apple', unit: 'Piece', price: '$699', purchasePrice: '$520', qty: 22, minQty: 8, warehouse: 'Branch B', status: 'Active', icon: '⌚' },
  { id: 7, name: 'Samsung Galaxy Tab S9', sku: 'TAB-031', category: 'Electronics', brand: 'Samsung', unit: 'Piece', price: '$849', purchasePrice: '$620', qty: 0, minQty: 5, warehouse: 'Main Store', status: 'Out of Stock', icon: '📱' },
  { id: 8, name: 'Corsair Vengeance RAM 32GB', sku: 'RAM-009', category: 'Components', brand: 'Corsair', unit: 'Piece', price: '$179', purchasePrice: '$120', qty: 18, minQty: 10, warehouse: 'Main Store', status: 'Active', icon: '🖥️' },
  { id: 9, name: 'Western Digital 2TB SSD', sku: 'STO-044', category: 'Components', brand: 'WD', unit: 'Piece', price: '$249', purchasePrice: '$180', qty: 25, minQty: 10, warehouse: 'Main Store', status: 'Active', icon: '💾' },
  { id: 10, name: 'Canon EOS R6 Mark II', sku: 'CAM-006', category: 'Cameras', brand: 'Canon', unit: 'Piece', price: '$2,499', purchasePrice: '$1,950', qty: 6, minQty: 3, warehouse: 'Branch A', status: 'Active', icon: '📷' },
];

const stockColor = (s) => s === 'Active' ? 'success' : s === 'Low Stock' ? 'warning' : 'danger';

export default function Products({ onProductClick }) {
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = products.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Products', value: products.length, icon: '📦', color: 'orange' },
          { label: 'Active', value: products.filter(p => p.status === 'Active').length, icon: '✅', color: 'green' },
          { label: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length, icon: '⚠️', color: 'purple' },
          { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, icon: '🚫', color: 'red' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header">
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Product List</div>
          <div className="table-toolbar">
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <option>All</option>
              {[...new Set(products.map(p => p.category))].map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="filter-select"><option>All Warehouses</option><option>Main Store</option><option>Branch A</option><option>Branch B</option></select>
            <button className="btn btn-outline btn-sm" onClick={() => setView(view === 'table' ? 'grid' : 'table')}>
              {view === 'table' ? '⊞ Grid' : '≡ Table'}
            </button>
            <button className="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </button>
          </div>
        </div>

        {view === 'table' ? (
          <>
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Product</th><th>SKU</th><th>Category</th><th>Brand</th>
                  <th className="text-right">Purchase Price</th>
                  <th className="text-right">Selling Price</th>
                  <th className="text-center">Qty</th>
                  <th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td onClick={() => onProductClick(p)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="table-img">{p.icon}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.warehouse}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#6b7280', fontSize: 12 }}>{p.sku}</td>
                    <td style={{ fontSize: 13 }}>{p.category}</td>
                    <td style={{ fontSize: 13 }}>{p.brand}</td>
                    <td className="text-right" style={{ color: '#6b7280' }}>{p.purchasePrice}</td>
                    <td className="text-right" style={{ fontWeight: 700 }}>{p.price}</td>
                    <td className="text-center">
                      <span style={{ fontWeight: 700, color: p.qty === 0 ? '#ef4444' : p.qty < p.minQty ? '#f59e0b' : '#10b981' }}>{p.qty}</span>
                    </td>
                    <td><span className={`badge badge-${stockColor(p.status)}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-outline btn-sm btn-icon" title="View" onClick={() => onProductClick(p)}>👁</button>
                        <button className="btn btn-outline btn-sm btn-icon" title="Edit">✏️</button>
                        <button className="btn btn-outline btn-sm btn-icon" title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <div className="pagination-info">Showing {filtered.length} of {products.length} products</div>
              <div className="pagination-btns">
                {['‹', '1', '2', '3', '›'].map((p, i) => (
                  <button key={i} className={`page-btn ${p === '1' ? 'active' : ''}`}>{p}</button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => onProductClick(p)} style={{
                border: '1px solid var(--border)', borderRadius: 10, padding: 16, cursor: 'pointer',
                transition: 'all 0.15s', background: 'var(--bg-white)'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12, background: 'var(--bg-main)', borderRadius: 8, padding: '12px 0' }}>{p.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>{p.sku}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{p.price}</span>
                  <span className={`badge badge-${stockColor(p.status)}`} style={{ fontSize: 10 }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
