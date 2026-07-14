import React, { useEffect, useState } from "react";
// import { products as originalProducts } from "./Products";

const API_BASE_URL = "http://localhost:3001/api";

function Purchase({ navigate }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("items");
  const [purchase, setPurchase] = useState({
    date: new Date().toISOString().slice(0, 10),
    supplierName: "",
    supplierAddress: "",
    supplierPhone: "",
    paymentMethod: "cash",
    chequeNumber: "",
    // authorizer: "",
    // sellerSignee: "",
    status: "paid"
  });
  const [history, setHistory] = useState([]);
  const [suppliers,setSuppliers]=useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
        .then(res => res.json())
        .then(data => {
            const normalized = Array.isArray(data) ? data.map(product => ({
                ...product,
                purchasePrice: Number(product.bp || 0),
                sellingPrice: Number(product.sp || 0),
                stock: Number(product.quantity || 0),
                minQty: Number(product.minQty || 0),
            })) : [];

            setProducts(normalized);
        })
        .catch(console.error);
    }, []);

    useEffect(() => {
      fetch(`${API_BASE_URL}/suppliers`)
        .then(res=>res.json())
        .then(setSuppliers);
    },[]);

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );
  const handleSupplierChange = (e) => {
  const selectedId = String(e.target.value);
  const supplier = suppliers.find(
      s => String(s.id) === selectedId
  );

  if (!supplier) return;

  setPurchase(prev => ({
      ...prev,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierAddress: supplier.address,
      supplierPhone: supplier.phone
  }));
  };

  const addToCart = (item) => {
    const existing = cart.find((cartItem) => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setSearch("");
    setShowResults(false);
    setSelectedProduct(item);
  };

  const updateQuantity = (id, quantity) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const removeCartItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setPurchase({ ...purchase, [name]: value });
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = cart.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0);

  const savePurchase = async () => {
    if (!purchase.supplierName.trim() || !purchase.supplierAddress.trim() || !purchase.supplierPhone.trim()) {
      alert("Please fill in supplier details.");
      return;
    }
    if (!purchase.authorizer.trim() || !purchase.sellerSignee.trim()) {
      alert("Please provide authorizer and seller signee.");
      return;
    }
    if (cart.length === 0) {
      alert("Add at least one item to the purchase list.");
      return;
    }
    if (purchase.paymentMethod === "cheque" && !purchase.chequeNumber.trim()) {
      alert("Please enter cheque number for cheque payment.");
      return;
    }

    const newPurchase = {
      id: `PO-${Date.now()}`,
      date: purchase.date,
      supplierName: purchase.supplierName,
      supplierAddress: purchase.supplierAddress,
      supplierPhone: purchase.supplierPhone,
      paymentMethod: purchase.paymentMethod,
      chequeNumber: purchase.chequeNumber,
      // authorizer: purchase.authorizer,
      // sellerSignee: purchase.sellerSignee,
      items: cart,
      totalAmount: orderTotal,
      itemCount,
      status: purchase.status
    };

    try {
      const response = await fetch(`${API_BASE_URL}/purchases`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            supplier_id:purchase.supplierId,
            payment_method:purchase.paymentMethod,
            cheque_number:purchase.chequeNumber,
            // authorizer:purchase.authorizer,
            items:cart.map(item=>({
                product_id:item.id,
                quantity:item.quantity,
                unit_cost:item.purchasePrice
            }))
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save purchase");
      }
      alert("Purchase order saved successfully.");
    } catch (err) {
      console.error("Error saving purchase:", err);
      const errorMsg = err.message || "Unknown error";
      alert("Failed to save purchase: " + errorMsg + "\n\nCheck terminal/console for full error details.");
    }
  };

  return (
    <div>
      <div className="table-card mb-4">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">New Purchase Order</div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Date: {purchase.date} • {itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('invoice-history')}>View Invoices</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', padding: '20px' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="filter-label">Purchase Date</label>
                <input type="date" name="date" value={purchase.date} onChange={handlePurchaseChange} className="filter-input" />
              </div>
              <div>
                  <label className="filter-label">Supplier</label>

                  <select
                      className="filter-input"
                      value={purchase.supplierId || ""}
                      onChange={handleSupplierChange}
                  >
                      <option value="">Select Supplier</option>

                      {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                          </option>
                      ))}
                  </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="filter-label">Supplier Address</label>
                <input type="text" name="supplierAddress" value={purchase.supplierAddress} onChange={handlePurchaseChange} className="filter-input" placeholder="Supplier address" />
              </div>
              <div>
                <label className="filter-label">Supplier Phone</label>
                <input type="text" name="supplierPhone" value={purchase.supplierPhone} onChange={handlePurchaseChange} className="filter-input" placeholder="Supplier phone" />
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <label className="filter-label">Search product by name or SKU</label>
              <div className="search-box" style={{ position: 'relative', width: '100%' }}>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
                  placeholder="Type to search products..."
                  className="filter-input"
                  style={{ width: '100%' }}
                />
              </div>
              {showResults && filteredProducts.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', zIndex: 10, maxHeight: '260px', overflowY: 'auto' }}>
                  {filteredProducts.map((item) => (
                    <div key={item.id} style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '12px' }} onClick={() => addToCart(item)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="table-img" style={{ width: '34px', height: '34px' }}>{item.icon}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{item.sku} • Stock {item.quantity}</div>
                        </div>
                      </div>
                      <span style={{ color: '#ff6b35', fontWeight: 700 }}>${item.purchasePrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="tab-bar" style={{ marginBottom: '16px' }}>
              {['items', 'summary'].map((tab) => (
                <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab === 'items' ? 'Item list' : 'Subtotal & total'}</div>
              ))}
            </div>

            {activeTab === 'items' ? (
              <div className="table-card" style={{ padding: '0', marginBottom: '20px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-right">Stock</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Unit Cost</th>
                      <th className="text-right">Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="table-img" style={{ width: '36px', height: '36px' }}>{item.icon}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>{item.sku}</div>
                          </div>
                        </td>
                        <td className="text-right" style={{ color: '#6b7280' }}>{item.quantity}</td>
                        <td className="text-right">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                            style={{ width: '60px', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', textAlign: 'right' }}
                          />
                        </td>
                        <td className="text-right">KSh {item.purchasePrice.toLocaleString()}</td>
                        <td className="text-right">KSh {(item.quantity * item.purchasePrice).toLocaleString()}</td>
                        <td className="text-right"><button className="btn btn-outline btn-sm" onClick={() => removeCartItem(item.id)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-card" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Items</div>
                      <div style={{ fontSize: '18px', fontWeight: 700 }}>{itemCount}</div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Payment method</div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1f2e' }}>{purchase.paymentMethod.toUpperCase()}</div>
                      {purchase.paymentMethod === 'cheque' && (
                        <div style={{ fontSize: 13, color: '#6b7280', marginTop: '4px' }}>Cheque #{purchase.chequeNumber}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Purchase Total</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff6b35' }}>${orderTotal.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="filter-label">Authorized By</label>
                <input type="text" name="authorizer" value={purchase.authorizer} onChange={handlePurchaseChange} className="filter-input" placeholder="Authorizer" />
              </div>
              <div>
                <label className="filter-label">Seller Signee</label>
                <input type="text" name="sellerSignee" value={purchase.sellerSignee} onChange={handlePurchaseChange} className="filter-input" placeholder="Seller signee" />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="filter-label">Status</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['paid', 'pending', 'credit'].map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', textTransform: 'capitalize' }}>
                      <input
                        type="radio"
                        name="status"
                        value={option}
                        checked={purchase.status === option}
                        onChange={handlePurchaseChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={savePurchase}>Save Purchase</button>
                <button className="btn btn-outline" onClick={() => { setCart([]); setSearch(""); setSelectedProduct(null); setPurchase({ ...purchase, supplierName: "", supplierAddress: "", supplierPhone: "", chequeNumber: "", authorizer: "", sellerSignee: "" }); }}>Reset</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="table-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1f2e' }}>Purchase Summary</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Current stock and supplier preview</div>
                </div>
                <div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>Supplier</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1f2e' }}>{purchase.supplierName || 'No supplier selected'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{purchase.supplierAddress || 'Supplier address'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{purchase.supplierPhone || 'Supplier phone'}</div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Current Item</div>
                {selectedProduct ? (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ fontWeight: 700 }}>{selectedProduct.name}</div>
                    <div style={{ color: '#6b7280', fontSize: 12 }}>Stock: {selectedProduct.stock} units</div>
                    <div style={{ color: '#6b7280', fontSize: 12 }}>Purchase price: ${selectedProduct.purchasePrice.toFixed(2)}</div>
                  </div>
                ) : (
                  <div style={{ color: '#9ca3af', fontSize: 13 }}>Search and select a product to preview stock details here.</div>
                )}
              </div>
            </div>

            <div className="table-card" style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Payment Method</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {['cash', 'card', 'cheque'].map((method) => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={purchase.paymentMethod === method}
                          onChange={handlePurchaseChange}
                        />
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                {purchase.paymentMethod === 'cheque' && (
                  <div>
                    <label className="filter-label">Cheque Number</label>
                    <input type="text" name="chequeNumber" value={purchase.chequeNumber} onChange={handlePurchaseChange} className="filter-input" placeholder="Enter cheque number" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">Purchase History</div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{history.length} previous purchases</span>
          </div>
        </div>
        {history.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No purchase orders yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Supplier</th>
                <th className="text-right">Items</th>
                <th className="text-right">Total</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {history.map((order) => (
                <tr key={order.id}>
                  <td style={{ color: '#ff6b35', fontWeight: 600 }}>{order.id}</td>
                  <td style={{ color: '#6b7280' }}>{order.date}</td>
                  <td>{order.supplierName}</td>
                  <td className="text-right">{order.itemCount}</td>
                  <td className="text-right" style={{ fontWeight: 700, color: '#ff6b35' }}>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Purchase;
