import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3001/api";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch invoices from API
    fetch(`${API_BASE_URL}/invoices`)
      .then(res => res.json())
      .then(data => {
        const normalized = Array.isArray(data) ? data.reverse() : [];
        setInvoices(normalized);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading invoices:", err);
        setLoading(false);
      });
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all invoices?")) {
      // Optionally call delete endpoint for each invoice
      setInvoices([]);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <h3>Loading invoice history...</h3>;
  }

  return (
    <div>
      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">Invoice History</div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Total invoices: {invoices.length}</span>
          </div>
          {invoices.length > 0 && (
            <button 
              onClick={clearHistory} 
              className="btn btn-outline"
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              Clear All History
            </button>
          )}
        </div>

        {invoices.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px', opacity: 0.5, margin: '0 auto 12px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No invoices found</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Create and save an invoice to see it here</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Invoice ID</th>
                  <th style={{ width: '12%' }}>Date</th>
                  <th style={{ width: '25%' }}>Customer</th>
                  <th style={{ width: '12%' }}>Items</th>
                  <th className="text-right" style={{ width: '15%' }}>Total Amount</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <React.Fragment key={inv.id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => toggleExpand(inv.id)}>
                      <td style={{ color: '#ff6b35', fontWeight: '600', fontSize: '13px' }}>{inv.id}</td>
                      <td style={{ color: '#6b7280', fontSize: '13px' }}>{inv.date}</td>
                      <td>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1a1f2e' }}>{inv.customerName}</div>
                        {inv.customerNumber && <div style={{ fontSize: '12px', color: '#9ca3af' }}>#{inv.customerNumber}</div>}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '600', color: '#3b82f6' }}>{inv.cart?.length || 0}</td>
                      <td className="text-right" style={{ fontWeight: '700', color: '#ff6b35', fontSize: '14px' }}>ksh {Number(inv.total).toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={(e) => { e.stopPropagation(); toggleExpand(inv.id); }}
                        >
                          {expandedId === inv.id ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === inv.id && (
                      <tr>
                        <td colSpan="6" style={{ padding: '0', borderBottom: 'none' }}>
                          <div style={{ backgroundColor: '#f9fafb', padding: '16px 20px', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ marginBottom: '12px' }}>
                              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Purchased</p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                {inv.cart?.map((item, index) => (
                                  <div key={index} style={{ padding: '10px 12px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                      <span style={{ fontWeight: '600', color: '#1a1f2e' }}>{item.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                                      <span>{item.quantity}x @ ksh {Number(item.price).toFixed(2)}</span>
                                      <span style={{ fontWeight: '700', color: '#ff6b35' }}>ksh {Number(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{ paddingTop: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1f2e' }}>
                                Invoice Total: <span style={{ color: '#ff6b35' }}>ksh {Number(inv.total).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default InvoiceHistory;