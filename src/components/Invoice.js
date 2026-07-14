import React, { useEffect, useState } from "react";
import { getProductIcon } from "../utils/iconMapper";

const API_BASE_URL = "http://localhost:3001/api";

function Invoice({ navigate }) { 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("paid");

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const cleanedProducts = Array.isArray(data) ? data.map(p => ({
          ...p,
          price: Number(p.sp || 0), 
          icon: getProductIcon(p.category) 
        })) : [];
        setProducts(cleanedProducts);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setProducts([]);
      });
  }, []);

  // Filter products based on search value input
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => 
      prevCart
        .map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Save invoice to backend API
  const saveInvoice = () => {
    if (!customerName.trim() || cart.length === 0) {
      alert("Please provide a customer name and add items to the cart.");
      return;
    }

    // Strip fields that shouldn't go to DB (icons, computed values)
    const cleanCart = cart.map(item => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      price: item.price,
      quantity: item.quantity
    }));

    const newInvoice = {
      customer_id: null,
      cart: cleanCart,
      total: total,
      i_date: new Date().toISOString(),
      status: status
    };

    fetch(`${API_BASE_URL}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInvoice)
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => { throw new Error(errData.error || "Failed to save invoice"); });
        }
        return res.json();
      })
      .then((data) => {
        alert("Invoice saved successfully!");
        setCart([]);
        setCustomerName("");
        setCustomerNumber("");
        navigate("sales"); 
      })
      .catch((err) => {
        console.error("Failed to save invoice:", err);
        alert("Failed to save invoice: " + err.message);
      });
  };

  return (
    <div>
      <div className="two-col mb-4">
        {/* CUSTOMER SECTION */}
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">Customer Details</div>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              className="filter-input"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              className="filter-input"
              placeholder="Customer Number"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
            />
          </div>
        </div>

        {/* SEARCH SECTION */}
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">Search Products</div>
          </div>
          <div style={{ padding: '20px' }}>
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="table-card mb-4">
        <div className="table-card-header">
          <div className="table-card-title">Available Products</div>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Showing {filteredProducts.length} of {products.length} products</span>
        </div>
        <div style={{ padding: '16px' }}>
          {filteredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      backgroundColor: '#f3f4f6', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <img
                        src={p.icon}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1a1f2e' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: '#ff6b35', fontWeight: '700' }}>KSh {Number(p.price).toLocaleString()}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(p)}>Add</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>No products found</div>
          )}
        </div>
      </div>

      {/* CART SECTION */}
      <div className="table-card mb-4">
        <div className="table-card-header">
          <div className="table-card-title">Shopping Cart</div>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
        </div>
        {cart.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Product</th>
                  <th className="text-right" style={{ width: '20%' }}>Price</th>
                  <th className="text-right" style={{ width: '15%' }}>Qty</th>
                  <th className="text-right" style={{ width: '20%' }}>Subtotal</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '6px', 
                        backgroundColor: '#f3f4f6', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '4px',
                        flexShrink: 0
                      }}>
                        <img
                          src={item.icon}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <span>{item.name}</span>
                    </td>
                    <td className="text-right">KSh {Number(item.price).toLocaleString()}</td>
                    <td className="text-right" style={{ fontWeight: '600' }}>{item.quantity}</td>
                    <td className="text-right" style={{ fontWeight: '700', color: '#ff6b35' }}>KSh {Number(item.price * item.quantity).toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f2e' }}>
                Total: <span style={{ color: '#ff6b35' }}>KSh {Number(total).toLocaleString()}</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Your cart is empty</div>
        )}
      </div>

      {/* STATUS SECTION */}
      <div className="table-card mb-4">
        <div className="table-card-header">
          <div className="table-card-title">Payment Status</div>
        </div>
        <div style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['paid', 'pending', 'credit'].map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', textTransform: 'capitalize' }}>
              <input
                type="radio"
                name="status"
                value={option}
                checked={status === option}
                onChange={(e) => setStatus(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* TOTAL AND ACTIONS SECTION */}
      <div className="table-card">
        <div style={{ padding: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={saveInvoice}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Invoice
          </button>
          
          <button className="btn btn-outline" onClick={() => navigate("invoice-history")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Invoice History
          </button>
        </div>
      </div>

    </div>
  );
}

export default Invoice;