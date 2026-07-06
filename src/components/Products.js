import React, { useState } from 'react';
import '../App.css';

export const products = [
  { id: 1, name: 'Wireless Mouse', sku: 'ACC-101', category: 'Accessories', brand: 'Logitech', unit: 'Piece', price: '$19.99', purchasePrice: '$12.00', qty: 85, minQty: 20, warehouse: 'Main Store', status: 'Active', sold: 520, icon: '🖱️' },
  { id: 2, name: 'Bluetooth Speaker', sku: 'AUD-102', category: 'Electronics', brand: 'JBL', unit: 'Piece', price: '$49.99', purchasePrice: '$32.00', qty: 60, minQty: 15, warehouse: 'Main Store', status: 'Active', sold: 340, icon: '🔊' },
  { id: 3, name: 'Laptop Stand', sku: 'ACC-103', category: 'Accessories', brand: 'Generic', unit: 'Piece', price: '$24.99', purchasePrice: '$14.00', qty: 40, minQty: 10, warehouse: 'Branch A', status: 'Active', sold: 275, icon: '💻' },
  { id: 4, name: 'USB-C Cable', sku: 'ACC-104', category: 'Accessories', brand: 'Anker', unit: 'Piece', price: '$9.99', purchasePrice: '$4.50', qty: 150, minQty: 30, warehouse: 'Main Store', status: 'Active', sold: 160, icon: '🔌' },
  { id: 5, name: 'Mechanical Keyboard', sku: 'ACC-105', category: 'Electronics', brand: 'Redragon', unit: 'Piece', price: '$59.99', purchasePrice: '$38.00', qty: 25, minQty: 10, warehouse: 'Main Store', status: 'Active', sold: 95, icon: '⌨️' },
  { id: 6, name: 'Phone Charger', sku: 'ACC-106', category: 'Accessories', brand: 'Anker', unit: 'Piece', price: '$14.99', purchasePrice: '$7.00', qty: 5, minQty: 20, warehouse: 'Main Store', status: 'Low Stock', sold: 80, icon: '🔋' },
  { id: 7, name: 'HDMI Cable', sku: 'ACC-107', category: 'Accessories', brand: 'Generic', unit: 'Piece', price: '$8.99', purchasePrice: '$4.00', qty: 0, minQty: 15, warehouse: 'Main Store', status: 'Out of Stock', sold: 65, icon: '🔗' },
  { id: 8, name: 'Power Bank', sku: 'ACC-108', category: 'Electronics', brand: 'Anker', unit: 'Piece', price: '$29.99', purchasePrice: '$18.00', qty: 30, minQty: 10, warehouse: 'Branch B', status: 'Active', sold: 110, icon: '🔋' },
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
          { label: 'Total Products', value: products.length, color: 'orange' },
          { label: 'Active', value: products.filter(p => p.status === 'Active').length, color: 'green' },
          { label: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length, color: 'purple' },
          { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, color: 'red' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header"></div>
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
              + Add Product
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
                        <button className="btn btn-outline btn-sm btn-icon" title="View" onClick={() => onProductClick(p)}><b>VIEW</b></button>
                        <button className="btn btn-outline btn-sm btn-icon" title="Edit"><b>EDIT</b></button>
                        <button className="btn btn-outline btn-sm btn-icon" title="Delete"><b>DELETE</b></button>
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