import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3001/api";

function StockTransfer({ navigate }) {
  const [products, setProducts] = useState([]);
  const [transfer, setTransfer] = useState({
    fromShop: "",
    toShop: "",
    itemId: "",
    quantity: "",
    reason: "",
    authorizer: ""
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [transfers, setTransfers] = useState([]);

  const shops = [
    { id: "main", name: "Main Store" },
    { id: "branch-a", name: "Branch A" },
    { id: "branch-b", name: "Branch B" }
  ];

  // Fetch products from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const cleanedProducts = Array.isArray(data) ? data.map(p => ({
          ...p,
          price: Number(p.sp || 0),
          stock: Number(p.quantity || 0)
        })) : [];
        setProducts(cleanedProducts);
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setProducts([]);
      });

    // Fetch transfers from API
    fetch(`${API_BASE_URL}/transfers`)
      .then(res => res.json())
      .then(data => {
        const storedTransfers = Array.isArray(data) ? data.reverse() : [];
        setTransfers(storedTransfers);
      })
      .catch(err => {
        console.error("Error loading transfers:", err);
      });
  }, []);

  // Search products
  const handleItemSearch = (e) => {
    const value = e.target.value;
    setTransfer({ ...transfer, itemId: value });

    if (value.trim()) {
      const results = products.filter(p =>
        p.name?.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSelectedItem(null);
    }
  };

  // Select item from search
  const selectItem = (item) => {
    setSelectedItem(item);
    setTransfer({ ...transfer, itemId: item.id });
    setShowSearchResults(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransfer({ ...transfer, [name]: value });
  };

  // Validate transfer
  const isFormValid = () => {
    return (
      transfer.fromShop &&
      transfer.toShop &&
      transfer.fromShop !== transfer.toShop &&
      selectedItem &&
      transfer.quantity &&
      parseInt(transfer.quantity) > 0 &&
      parseInt(transfer.quantity) <= selectedItem.stock &&
      transfer.reason.trim() &&
      transfer.authorizer.trim()
    );
  };

  // Submit transfer
  const submitTransfer = () => {
    if (!isFormValid()) {
      alert("Please fill in all fields correctly");
      return;
    }

    const newTransfer = {
      id: "ST-" + Date.now(),
      date: new Date().toLocaleDateString(),
      fromShop: shops.find(s => s.id === transfer.fromShop)?.name,
      toShop: shops.find(s => s.id === transfer.toShop)?.name,
      item: selectedItem,
      quantity: parseInt(transfer.quantity),
      reason: transfer.reason,
      authorizer: transfer.authorizer,
      status: "Pending Approval"
    };

    try {
      const existingTransfers = JSON.parse(localStorage.getItem("stock_transfers")) || [];
      existingTransfers.push(newTransfer);
      localStorage.setItem("stock_transfers", JSON.stringify(existingTransfers));

      alert("Stock transfer request submitted successfully!");
      setTransfer({ fromShop: "", toShop: "", itemId: "", quantity: "", reason: "", authorizer: "" });
      setSelectedItem(null);
      setTransfers([newTransfer, ...transfers]);
    } catch (err) {
      console.error("Error saving transfer:", err);
      alert("Failed to save transfer");
    }
  };

  return (
    <div>
      {/* TRANSFER FORM */}
      <div className="table-card mb-4">
        <div className="table-card-header">
          <div className="table-card-title">Create Stock Transfer</div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* FROM SHOP */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Transfer From
              </label>
              <select
                name="fromShop"
                value={transfer.fromShop}
                onChange={handleChange}
                className="filter-select"
                style={{ width: '100%' }}
              >
                <option value="">Select source shop...</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>

            {/* TO SHOP */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Transfer To
              </label>
              <select
                name="toShop"
                value={transfer.toShop}
                onChange={handleChange}
                className="filter-select"
                style={{ width: '100%' }}
              >
                <option value="">Select destination shop...</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ITEM SELECTION */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Stock Item
            </label>
            <div className="search-box" style={{ width: '100%', position: 'relative', backgroundColor: '#fff', border: '1px solid #e5e7eb', padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '12px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search product..."
                value={transfer.itemId}
                onChange={handleItemSearch}
                className="filter-input"
                style={{ border: 'none', width: '100%', padding: '8px 12px' }}
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                {searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => selectItem(item)}
                    style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f8', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onMouseOver={(e) => e.target.parentElement.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.target.parentElement.style.backgroundColor = '#fff'}
                  >
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1f2e' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>Stock: {item.stock} units</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SELECTED ITEM DETAILS */}
          {selectedItem && (
            <div style={{ padding: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{selectedItem.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1f2e' }}>{selectedItem.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Current Stock: <span style={{ fontWeight: '600', color: '#10b981' }}>{selectedItem.stock} units</span></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Price:</span> <span style={{ fontWeight: '600', color: '#ff6b35' }}>${selectedItem.price.toFixed(2)}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Value of Transfer:</span> <span style={{ fontWeight: '700', color: '#ff6b35' }}>${(selectedItem.price * (parseInt(transfer.quantity) || 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quantity to Transfer
            </label>
            <input
              type="number"
              name="quantity"
              value={transfer.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="1"
              max={selectedItem?.stock || 0}
              className="filter-input"
              style={{ width: '100%' }}
            />
            {selectedItem && transfer.quantity && (
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Available: {selectedItem.stock} units {parseInt(transfer.quantity) > selectedItem.stock && <span style={{ color: '#ef4444' }}>⚠ Quantity exceeds available stock</span>}
              </div>
            )}
          </div>

          {/* REASON */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Reason for Transfer
            </label>
            <textarea
              name="reason"
              value={transfer.reason}
              onChange={handleChange}
              placeholder="Explain the reason for this stock transfer (e.g., rebalancing inventory, customer demand, stock optimization)..."
              className="filter-input"
              style={{ width: '100%', minHeight: '80px', resize: 'vertical', padding: '10px 12px' }}
            />
          </div>

          {/* AUTHORIZER */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Authorized By
            </label>
            <input
              type="text"
              name="authorizer"
              value={transfer.authorizer}
              onChange={handleChange}
              placeholder="Name of person authorizing this transfer"
              className="filter-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              onClick={submitTransfer}
              disabled={!isFormValid()}
              style={{ opacity: isFormValid() ? 1 : 0.5, cursor: isFormValid() ? 'pointer' : 'not-allowed' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              Submit Transfer Request
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => {
                setTransfer({ fromShop: "", toShop: "", itemId: "", quantity: "", reason: "", authorizer: "" });
                setSelectedItem(null);
              }}
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>

      {/* TRANSFER HISTORY */}
      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">Transfer History</div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Total transfers: {transfers.length}</span>
          </div>
        </div>

        {transfers.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, margin: '0 auto 12px', display: 'block' }}><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"/></svg>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No transfers yet</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Submit a stock transfer request to see it here</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Transfer ID</th>
                <th style={{ width: '10%' }}>Date</th>
                <th style={{ width: '12%' }}>From</th>
                <th style={{ width: '12%' }}>To</th>
                <th style={{ width: '25%' }}>Item</th>
                <th className="text-right" style={{ width: '8%' }}>Qty</th>
                <th style={{ width: '12%' }}>Authorizer</th>
                <th style={{ width: '9%', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id}>
                  <td style={{ color: '#ff6b35', fontWeight: '600', fontSize: '13px' }}>{t.id}</td>
                  <td style={{ color: '#6b7280', fontSize: '13px' }}>{t.date}</td>
                  <td style={{ fontSize: '13px', color: '#1a1f2e' }}>{t.fromShop}</td>
                  <td style={{ fontSize: '13px', color: '#1a1f2e' }}>{t.toShop}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <span style={{ fontSize: '16px' }}>{t.item?.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1a1f2e' }}>{t.item?.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>${t.item?.price.toFixed(2)} each</div>
                    </div>
                  </td>
                  <td className="text-right" style={{ fontWeight: '700', color: '#3b82f6' }}>{t.quantity}</td>
                  <td style={{ fontSize: '13px', color: '#6b7280' }}>{t.authorizer}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge badge-warning`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StockTransfer;
