import React, { useState } from 'react';
import '../App.css';

const initItems = [
  { id: 1, sku: 'ACC-101', name: 'Wireless Mouse', category: 'Accessories', systemQty: 85, countedQty: '', icon: '🖱️', warehouse: 'Main Store', unit: 'Piece', costPrice: 12.00 },
  { id: 2, sku: 'AUD-102', name: 'Bluetooth Speaker', category: 'Electronics', systemQty: 60, countedQty: '', icon: '🔊', warehouse: 'Main Store', unit: 'Piece', costPrice: 32.00 },
  { id: 3, sku: 'ACC-103', name: 'Laptop Stand', category: 'Accessories', systemQty: 40, countedQty: '', icon: '💻', warehouse: 'Branch A', unit: 'Piece', costPrice: 14.00 },
  { id: 4, sku: 'ACC-104', name: 'USB-C Cable', category: 'Accessories', systemQty: 150, countedQty: '', icon: '🔌', warehouse: 'Main Store', unit: 'Piece', costPrice: 4.50 },
  { id: 5, sku: 'ACC-105', name: 'Mechanical Keyboard', category: 'Electronics', systemQty: 25, countedQty: '', icon: '⌨️', warehouse: 'Main Store', unit: 'Piece', costPrice: 38.00 },
  { id: 6, sku: 'ACC-106', name: 'Phone Charger', category: 'Accessories', systemQty: 5, countedQty: '', icon: '🔋', warehouse: 'Main Store', unit: 'Piece', costPrice: 7.00 },
  { id: 7, sku: 'ACC-107', name: 'HDMI Cable', category: 'Accessories', systemQty: 0, countedQty: '', icon: '🔗', warehouse: 'Main Store', unit: 'Piece', costPrice: 4.00 },
  { id: 8, sku: 'ACC-108', name: 'Power Bank', category: 'Electronics', systemQty: 30, countedQty: '', icon: '🔋', warehouse: 'Branch B', unit: 'Piece', costPrice: 18.00 },
];

export default function StockReconciliation() {
  const [items, setItems] = useState(initItems);
  const [warehouse, setWarehouse] = useState('All');
  const [category, setCategory] = useState('All');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('count');

  const updateCount = (id, val) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, countedQty: val } : it));
  };

  const counted = items.filter(i => i.countedQty !== '');
  const withDiff = counted.map(i => ({ ...i, diff: parseInt(i.countedQty) - i.systemQty }));
  const overstock = withDiff.filter(i => i.diff > 0);
  const understock = withDiff.filter(i => i.diff < 0);
  const matched = withDiff.filter(i => i.diff === 0);
  const totalVarianceValue = withDiff.reduce((acc, i) => acc + (i.diff * i.costPrice), 0);

  const filtered = items.filter(i =>
    (warehouse === 'All' || i.warehouse === warehouse) &&
    (category === 'All' || i.category === category)
  );

  const diffColor = (diff) => diff === undefined || diff === null || isNaN(diff) ? '' : diff > 0 ? '#10b981' : diff < 0 ? '#ef4444' : '#6b7280';

  return (
    <div>
      {/* Summary */}
      <div className="recon-summary">
        {[
          { label: 'Total Items', value: items.length, color: '#1a1f2e' },
          { label: 'Counted', value: counted.length, color: '#3b82f6' },
          { label: 'Matched', value: matched.length, color: '#10b981' },
          { label: 'Overstock', value: overstock.length, color: '#10b981' },
          { label: 'Understock', value: understock.length, color: '#ef4444' },
        ].map((s, i) => (
          <div className="recon-card" key={i}>
            <div className="recon-num" style={{ color: s.color }}>{s.value}</div>
            <div className="recon-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {counted.length > 0 && (
        <div style={{
          background: totalVarianceValue < 0 ? '#fef2f2' : '#ecfdf5',
          border: `1px solid ${totalVarianceValue < 0 ? '#fecaca' : '#a7f3d0'}`,
          borderRadius: 10, padding: '12px 20px', marginBottom: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ fontSize: 13.5, color: '#6b7280' }}>
            Total Variance Value: <strong style={{ color: totalVarianceValue < 0 ? '#ef4444' : '#10b981', fontSize: 16 }}>
              {totalVarianceValue < 0 ? '-' : '+'}${Math.abs(totalVarianceValue).toLocaleString()}
            </strong>
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{counted.length} of {items.length} items counted</div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        {[['count', 'Stock Count'], ['variance', 'Variance Report']].map(([id, label]) => (
          <div key={id} className={`tab ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
            {label} {id === 'variance' && counted.length > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: 20, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>{counted.length}</span>}
          </div>
        ))}
      </div>

      {activeTab === 'count' && (
        <>
          {/* Filters & Actions */}
          <div className="filter-bar">
            <select className="filter-select" value={warehouse} onChange={e => setWarehouse(e.target.value)}>
              <option>All</option>
              <option>Main Store</option>
              <option>Branch A</option>
              <option>Branch B</option>
            </select>
            <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option>All</option>
              {[...new Set(items.map(i => i.category))].map(c => <option key={c}>{c}</option>)}
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setItems(prev => prev.map(i => ({ ...i, countedQty: String(i.systemQty) })))}>
                Auto-fill System Qty
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setItems(initItems)}>
                Reset
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setSubmitted(true)} disabled={counted.length === 0}>
                Submit Reconciliation
              </button>
            </div>
          </div>

          {submitted && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '14px 20px', marginBottom: 16, color: '#065f46', fontSize: 14, fontWeight: 600 }}>
              Stock reconciliation submitted successfully! {understock.length} discrepancies will be adjusted.
            </div>
          )}

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Warehouse</th>
                  <th className="text-center">System Qty</th>
                  <th className="text-center">Counted Qty</th>
                  <th className="text-center">Difference</th>
                  <th className="text-center">Variance ($)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const counted = item.countedQty !== '';
                  const diff = counted ? parseInt(item.countedQty) - item.systemQty : null;
                  const varValue = diff !== null ? diff * item.costPrice : null;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="table-img">{item.icon}</div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: '#6b7280' }}>{item.sku}</td>
                      <td style={{ fontSize: 13 }}>{item.category}</td>
                      <td style={{ fontSize: 13 }}>{item.warehouse}</td>
                      <td className="text-center" style={{ fontWeight: 700 }}>{item.systemQty}</td>
                      <td className="text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.countedQty}
                          onChange={e => updateCount(item.id, e.target.value)}
                          placeholder="Enter..."
                          style={{
                            width: 80, textAlign: 'center', padding: '6px 8px',
                            border: '1px solid var(--border)', borderRadius: 6, fontSize: 13,
                            outline: 'none', fontWeight: 600,
                            borderColor: diff !== null ? (diff === 0 ? '#10b981' : diff > 0 ? '#3b82f6' : '#ef4444') : 'var(--border)'
                          }}
                        />
                      </td>
                      <td className="text-center" style={{ fontWeight: 700, color: diffColor(diff) }}>
                        {diff !== null ? (diff > 0 ? `+${diff}` : diff) : '—'}
                      </td>
                      <td className="text-center" style={{ fontWeight: 600, color: diffColor(varValue) }}>
                        {varValue !== null ? (varValue > 0 ? `+$${varValue.toLocaleString()}` : `-$${Math.abs(varValue).toLocaleString()}`) : '—'}
                      </td>
                      <td>
                        {!counted ? (
                          <span className="badge badge-warning">Pending</span>
                        ) : diff === 0 ? (
                          <span className="badge badge-success">Matched</span>
                        ) : diff > 0 ? (
                          <span className="badge badge-info">Overstock</span>
                        ) : (
                          <span className="badge badge-danger">Short</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Reconciliation Notes</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Add notes about this stock count (e.g. Monthly count, June 2026)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'variance' && (
        <>
          {counted.length === 0 ? (
            <div className="table-card">
              <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>No counts entered yet</div>
                <div style={{ fontSize: 13 }}>Switch to Stock Count tab and enter counted quantities to see variances</div>
              </div>
            </div>
          ) : (
            <div className="table-card">
              <div className="table-card-header">
                <div className="table-card-title">Variance Summary</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline btn-sm">Export Report</button>
                  <button className="btn btn-primary btn-sm">Adjust Inventory</button>
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>Product</th><th className="text-center">System</th><th className="text-center">Counted</th><th className="text-center">Variance</th><th className="text-center">Value Impact</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {withDiff.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="table-img">{item.icon}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center" style={{ fontWeight: 700 }}>{item.systemQty}</td>
                      <td className="text-center" style={{ fontWeight: 700 }}>{item.countedQty}</td>
                      <td className="text-center" style={{ fontWeight: 800, color: diffColor(item.diff) }}>
                        {item.diff > 0 ? `+${item.diff}` : item.diff}
                      </td>
                      <td className="text-center" style={{ fontWeight: 600, color: diffColor(item.diff * item.costPrice) }}>
                        {item.diff > 0 ? `+$${(item.diff * item.costPrice).toLocaleString()}` : `-$${Math.abs(item.diff * item.costPrice).toLocaleString()}`}
                      </td>
                      <td>
                        {item.diff === 0 ? <span className="badge badge-success">Matched</span>
                          : item.diff > 0 ? <span className="badge badge-info">Surplus</span>
                          : <span className="badge badge-danger">Deficit</span>}
                      </td>
                      <td>
                        {item.diff !== 0 && (
                          <button className="btn btn-outline btn-sm">Adjust</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: 16, borderTop: '1px solid var(--border)', background: '#f9fafb', borderRadius: '0 0 10px 10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                  {[
                    { label: 'Total Counted', value: counted.length, color: '#3b82f6' },
                    { label: 'Matched', value: matched.length, color: '#10b981' },
                    { label: 'Discrepancies', value: withDiff.filter(i => i.diff !== 0).length, color: '#ef4444' },
                    { label: 'Net Value Impact', value: `${totalVarianceValue >= 0 ? '+' : ''}$${totalVarianceValue.toLocaleString()}`, color: totalVarianceValue >= 0 ? '#10b981' : '#ef4444' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 8, padding: 12, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}