import React, { useState } from 'react';
import '../App.css';

const stockHistory = [
  { date: 'Jun 28, 2026', type: 'Sale', ref: '#INV-0452', qty: -5, balance: 45, note: 'POS Sale' },
  { date: 'Jun 25, 2026', type: 'Purchase', ref: '#PO-2026-099', qty: +20, balance: 50, note: 'Restock from Apple Inc.' },
  { date: 'Jun 20, 2026', type: 'Sale', ref: '#INV-0401', qty: -8, balance: 30, note: 'POS Sale' },
  { date: 'Jun 15, 2026', type: 'Adjustment', ref: '#ADJ-011', qty: +3, balance: 38, note: 'Inventory count correction' },
  { date: 'Jun 10, 2026', type: 'Return', ref: '#RET-007', qty: +1, balance: 35, note: 'Customer return - defective' },
  { date: 'Jun 05, 2026', type: 'Sale', ref: '#INV-0381', qty: -12, balance: 34, note: 'Bulk order' },
];

const relatedProducts = [
  { name: 'Apple iPhone 14 Pro', price: '$999', stock: 15, icon: '📱' },
  { name: 'Apple iPhone 15', price: '$899', stock: 28, icon: '📱' },
  { name: 'Apple MagSafe Case', price: '$59', stock: 80, icon: '🔲' },
  { name: 'Apple USB-C Cable', price: '$29', stock: 120, icon: '🔌' },
];

const histTypeColor = { Sale: 'danger', Purchase: 'success', Adjustment: 'info', Return: 'warning' };

function ProductDetail({ product, onBack }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const p = product || {
    name: 'Apple iPhone 15 Pro Max',
    sku: 'PHN-001',
    category: 'Electronics',
    brand: 'Apple',
    unit: 'Piece',
    price: '$1,299',
    purchasePrice: '$950',
    qty: 45,
    minQty: 10,
    warehouse: 'Main Store',
    status: 'Active',
    icon: '📱',
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={onBack}>
            ← Back to Products
          </button>
          <div className="page-header-title">{p.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm">Edit Product</button>
          <button className="btn btn-outline btn-sm">Delete</button>
          <button className="btn btn-primary btn-sm">Add Stock</button>
        </div>
      </div>

      {/* Top Detail Grid */}
      <div className="detail-grid">
        {/* Image Panel */}
        <div className="detail-img-card">
          <div className="product-big-img">{p.icon}</div>
          <div className="thumb-row">
            {[p.icon, '📦', '🏷️', '📄'].map((icon, i) => (
              <div key={i} className={`thumb ${activeThumb === i ? 'active' : ''}`} onClick={() => setActiveThumb(i)}>
                {icon}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <span className={`badge badge-${p.status === 'Active' ? 'success' : p.status === 'Low Stock' ? 'warning' : 'danger'}`} style={{ fontSize: 12 }}>
              {p.status}
            </span>
          </div>
        </div>

        {/* Info Panel */}
        <div className="detail-info-card">
          <div className="detail-title">{p.name}</div>
          <div className="detail-sku">SKU: {p.sku}</div>
          <div className="detail-price">{p.price} <span style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 400 }}>{p.purchasePrice}</span></div>

          <div className="detail-divider"></div>

          {[
            ['Category', p.category],
            ['Brand', p.brand],
            ['Unit', p.unit],
            ['Warehouse', p.warehouse],
            ['Min Qty Alert', p.minQty],
            ['Barcode', `BAR-${p.sku}`],
          ].map(([k, v]) => (
            <div className="detail-row" key={k}>
              <div className="detail-key">{k}</div>
              <div className="detail-val">{v}</div>
            </div>
          ))}

          <div className="detail-divider"></div>

          {/* Stock Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'In Stock', value: p.qty, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Min Level', value: p.minQty, color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Ordered', value: 20, color: '#3b82f6', bg: '#eff6ff' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="detail-divider"></div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }}>Create Sale</button>
            <button className="btn btn-outline" style={{ flex: 1 }}>Create Purchase</button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tab-bar">
        {[['overview', 'Overview'], ['stock-history', 'Stock History'], ['related', 'Related Products']].map(([id, label]) => (
          <div key={id} className={`tab ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
            {label}
          </div>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="two-col">
          <div className="table-card">
            <div className="table-card-header"><div className="table-card-title">Product Description</div></div>
            <div style={{ padding: '16px 20px', color: '#6b7280', fontSize: 13.5, lineHeight: 1.8 }}>
              The {p.name} is a premium-grade product from {p.brand}, designed for performance and reliability. 
              It comes fully tested and packaged, ready for immediate retail or online sale. 
              All items in this category include standard manufacturer warranty.
              <br /><br />
              <strong style={{ color: 'var(--text-primary)' }}>Key Features:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Premium build quality</li>
                <li>Manufacturer warranty included</li>
                <li>Available for bulk orders</li>
                <li>Compatible with all standard accessories</li>
              </ul>
            </div>
          </div>
          <div className="table-card">
            <div className="table-card-header"><div className="table-card-title">Pricing & Tax</div></div>
            <div style={{ padding: '16px 20px' }}>
              {[
                ['Purchase Price', p.purchasePrice],
                ['Selling Price', p.price],
                ['Profit Margin', '27.5%'],
                ['Tax Rate', '7.5% VAT'],
                ['Discount', '0%'],
                ['Final Price (w/ tax)', '$1,396.73'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: '#6b7280' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stock-history' && (
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">Stock Movement History</div>
            <div className="table-toolbar">
              <select className="filter-select"><option>All Types</option><option>Sale</option><option>Purchase</option><option>Adjustment</option><option>Return</option></select>
              <button className="btn btn-outline btn-sm">Export</button>
            </div>
          </div>
          <table>
            <thead>
              <tr><th>Date</th><th>Type</th><th>Reference</th><th className="text-center">Qty Change</th><th className="text-center">Balance</th><th>Note</th></tr>
            </thead>
            <tbody>
              {stockHistory.map((h, i) => (
                <tr key={i}>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{h.date}</td>
                  <td><span className={`badge badge-${histTypeColor[h.type]}`}>{h.type}</span></td>
                  <td style={{ color: '#3b82f6', fontWeight: 600, fontSize: 13 }}>{h.ref}</td>
                  <td className="text-center" style={{ fontWeight: 700, color: h.qty > 0 ? '#10b981' : '#ef4444' }}>
                    {h.qty > 0 ? `+${h.qty}` : h.qty}
                  </td>
                  <td className="text-center" style={{ fontWeight: 700 }}>{h.balance}</td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'related' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {relatedProducts.map((r, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 10, background: 'var(--bg-main)', borderRadius: 8, padding: '10px 0' }}>{r.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{r.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{r.price}</span>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{r.stock} in stock</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default ProductDetail;