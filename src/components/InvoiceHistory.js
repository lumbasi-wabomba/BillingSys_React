import React, { useEffect, useState } from "react";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Read directly from Local Storage where Invoice.js saves its data
    try {
      const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
      // Reverse them so the newest saved invoices show up at the top
      setInvoices(storedInvoices.reverse());
    } catch (err) {
      console.error("Error reading invoices from localStorage:", err);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all invoice records?")) {
      localStorage.removeItem("invoices");
      setInvoices([]);
    }
  };

  return (
    <div className="history-page" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Invoice History</h2>
        {invoices.length > 0 && (
          <button 
            onClick={clearHistory} 
            style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Clear All History
          </button>
        )}
      </div>

      {invoices.length === 0 ? (
        <div className="card" style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
          No invoices found. Create and save an invoice to see it here!
        </div>
      ) : (
        <div className="history-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {invoices.map((inv) => (
            <div key={inv.id} className="card" style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "8px", background: "var(--bg-white)" }}>
              <p><b>Invoice ID:</b> {inv.id}</p>
              <p><b>Date:</b> {inv.date}</p>
              <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "10px 0" }} />
              <p><b>Customer Name:</b> {inv.customerName}</p>
              {inv.customerNumber && <p><b>Customer Number:</b> {inv.customerNumber}</p>}
              
              <div style={{ margin: "12px 0", fontSize: "13px", color: "#4b5563" }}>
                <b>Items Purchased:</b>
                <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  {inv.cart?.map((item, index) => (
                    <li key={index}>
                      {item.icon} {item.name} ({item.quantity}x) — ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <h3 style={{ margin: "0", color: "var(--primary)", textAlign: "right" }}>
                Total: ${inv.total.toFixed(2)}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvoiceHistory;