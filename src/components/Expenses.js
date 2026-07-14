import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3001/api";

function Expenses({ navigate }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("items");
  const [expense, setExpense] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    supplierName: "",
    supplierAddress: "",
    supplierPhone: "",
    paymentMethod: "cash",
    chequeNumber: "",
    authorizer: "",
    sellerSignee: "",
    notes: ""
  });
  const [manualItem, setManualItem] = useState({
    description: "",
    quantity: 1,
    unitCost: 0
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch products from API
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const cleaned = Array.isArray(data) ? data.map((item) => ({
          ...item,
          purchasePrice: Number(item.bp || 0),
          stock: Number(item.quantity || 0)
        })) : [];
        setProducts(cleaned);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setProducts([]);
      });

    // Fetch expense history from backend
    fetch(`${API_BASE_URL}/expenses`)
      .then((res) => res.json())
      .then((data) => {
        const historyData = Array.isArray(data) ? data : [];
        setHistory(historyData);
      })
      .catch((err) => {
        console.error("Failed to load expense history:", err);
        setHistory([]);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowResults(Boolean(e.target.value.trim()));
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setSearch(product.name);
    setShowResults(false);
  };

  const handleManualItemChange = (e) => {
    const { name, value } = e.target;
    setManualItem({
      ...manualItem,
      [name]: name === "quantity" ? Math.max(1, Number(value)) : name === "unitCost" ? Number(value) : value
    });
  };

  const addExpenseItem = () => {
    if (!selectedProduct && !manualItem.description.trim()) return;

    if (selectedProduct) {
      const existing = items.find((item) => item.id === selectedProduct.id);
      if (existing) {
        setItems(items.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setItems([...items, { ...selectedProduct, quantity: 1, unitCost: selectedProduct.purchasePrice }]);
      }
      setSearch("");
      setSelectedProduct(null);
      return;
    }

    const newId = `EXPITEM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems([...items, {
      id: newId,
      name: manualItem.description,
      sku: "",
      icon: "📄",
      stock: "—",
      quantity: manualItem.quantity,
      unitCost: manualItem.unitCost
    }]);
    setManualItem({ description: "", quantity: 1, unitCost: 0 });
  };

  const updateItemQuantity = (id, value) => {
    const quantity = Math.max(1, Number(value));
    setItems(items.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const updateItemCost = (id, value) => {
    const unitCost = Math.max(0, Number(value));
    setItems(items.map((item) => item.id === id ? { ...item, unitCost } : item));
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const saveExpense = () => {
    if (!expense.title.trim() || !expense.supplierName.trim() || !expense.supplierPhone.trim() || !expense.authorizer.trim() || !expense.sellerSignee.trim()) {
      alert("Please complete all required fields.");
      return;
    }
    if (items.length === 0) {
      alert("Add at least one expense line item.");
      return;
    }
    if (expense.paymentMethod === "cheque" && !expense.chequeNumber.trim()) {
      alert("Enter a cheque number for cheque payments.");
      return;
    }

    const newExpense = {
      e_date: expense.date,
      payment_method: expense.paymentMethod,
      mpesa_code: expense.paymentMethod === "mpesa" ? expense.chequeNumber : null,
      cheque_no: expense.paymentMethod === "cheque" ? expense.chequeNumber : null,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku || "",
        quantity: item.quantity,
        unitCost: item.unitCost
      })),
      total: subtotal,
      notes: expense.notes
    };

    // Save to backend API
    fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense)
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory([data, ...history]);
        setItems([]);
        setExpense({
          ...expense,
          title: "",
          supplierName: "",
          supplierAddress: "",
          supplierPhone: "",
          chequeNumber: "",
          authorizer: "",
          sellerSignee: "",
          notes: ""
        });
        setSearch("");
        setSelectedProduct(null);
        alert("Expense saved.");
      })
      .catch((err) => {
        console.error("Failed to save expense:", err);
        alert("Could not save expense.");
      });
  };

  return (
    <div>
      <div className="table-card mb-4">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">Expense Entry</div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{totalItems} item{totalItems !== 1 ? 's' : ''} • {expense.date}</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('dashboard')}>Back to Dashboard</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', padding: '20px' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expense Title</label>
                <input type="text" name="title" value={expense.title} onChange={handleExpenseChange} className="filter-input" placeholder="What is this expense for?" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expense Date</label>
                <input type="date" name="date" value={expense.date} onChange={handleExpenseChange} className="filter-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Supplier Name</label>
                <input type="text" name="supplierName" value={expense.supplierName} onChange={handleExpenseChange} className="filter-input" placeholder="Supplier or vendor" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Supplier Phone</label>
                <input type="text" name="supplierPhone" value={expense.supplierPhone} onChange={handleExpenseChange} className="filter-input" placeholder="Phone number" />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Supplier Address</label>
              <input type="text" name="supplierAddress" value={expense.supplierAddress} onChange={handleExpenseChange} className="filter-input" placeholder="Supplier address" />
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Link Stock Item (optional)</label>
              <input type="text" value={search} onChange={handleSearchChange} placeholder="Search items by name or SKU" className="filter-input" />
              {showResults && filteredProducts.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', zIndex: 10, maxHeight: '220px', overflowY: 'auto' }}>
                  {filteredProducts.map((product) => (
                    <div key={product.id} style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => selectProduct(product)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="table-img" style={{ width: 32, height: 32 }}>{product.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{product.name}</div>
                          <div style={{ color: '#6b7280', fontSize: 12 }}>{product.sku} • Stock {product.stock}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#ff6b35' }}>ksh {Number(product.purchasePrice).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Description</label>
                <input type="text" name="description" value={manualItem.description} onChange={handleManualItemChange} className="filter-input" placeholder="Describe expense item" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</label>
                <input type="number" name="quantity" min="1" value={manualItem.quantity} onChange={handleManualItemChange} className="filter-input" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit Cost</label>
                <input type="number" name="unitCost" min="0" step="0.01" value={manualItem.unitCost} onChange={handleManualItemChange} className="filter-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '16px', marginBottom: '20px' }}>
              <button className="btn btn-primary" onClick={addExpenseItem} disabled={!selectedProduct && !manualItem.description.trim()}>Add Item</button>
              <button className="btn btn-outline" onClick={() => {
                setSearch("");
                setShowResults(false);
                setSelectedProduct(null);
                setManualItem({ description: "", quantity: 1, unitCost: 0 });
              }}>Clear</button>
            </div>

            <div className="tab-bar" style={{ marginBottom: '16px' }}>
              <div className={`tab ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>Item list</div>
              <div className={`tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Subtotal & total</div>
            </div>

            {activeTab === 'items' ? (
              <div className="table-card" style={{ padding: 0 }}>
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
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div className="table-img" style={{ width: 36, height: 36 }}>{item.icon || '📄'}</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{item.name}</div>
                            <div style={{ color: '#6b7280', fontSize: 12 }}>{item.sku || '—'}</div>
                          </div>
                        </td>
                        <td className="text-right" style={{ color: '#6b7280' }}>{item.stock ?? '—'}</td>
                        <td className="text-right">
                          <input type="number" min="1" value={item.quantity} onChange={(e) => updateItemQuantity(item.id, e.target.value)} style={{ width: 60, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', textAlign: 'right' }} />
                        </td>
                        <td className="text-right">
                          <input type="number" min="0" step="0.01" value={item.unitCost} onChange={(e) => updateItemCost(item.id, e.target.value)} style={{ width: 80, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', textAlign: 'right' }} />
                        </td>
                        <td className="text-right" style={{ fontWeight: 700 }}>ksh {Number(item.quantity * item.unitCost).toFixed(2)}</td>
                        <td className="text-right"><button className="btn btn-outline btn-sm" onClick={() => removeItem(item.id)}>Remove</button></td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>No expense items yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-card" style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Items added</div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{totalItems}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Subtotal</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>${subtotal.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Total</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#ff6b35' }}>ksh {Number(subtotal).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Authorized By</label>
                <input type="text" name="authorizer" value={expense.authorizer} onChange={handleExpenseChange} className="filter-input" placeholder="Authorized person" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seller Signee</label>
                <input type="text" name="sellerSignee" value={expense.sellerSignee} onChange={handleExpenseChange} className="filter-input" placeholder="Seller signee" />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notes</label>
              <textarea name="notes" value={expense.notes} onChange={handleExpenseChange} className="filter-input" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Additional details about this expense"></textarea>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={saveExpense}>Save Expense</button>
              <button className="btn btn-outline" onClick={() => { setItems([]); setSearch(""); setSelectedProduct(null); setExpense({ ...expense, title: "", supplierName: "", supplierAddress: "", supplierPhone: "", chequeNumber: "", authorizer: "", sellerSignee: "", notes: "" }); }}>Reset</button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="table-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1f2e' }}>Receipt Preview</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Small expense image card</div>
                </div>
                <div style={{ width: 72, height: 72, background: '#f3f4f8', borderRadius: 18, display: 'grid', placeItems: 'center', fontSize: 32 }}>
                  {selectedProduct?.icon || '📄'}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: '8px' }}>Expense summary</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Supplier</span><span>{expense.supplierName || '—'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Payment</span><span>{expense.paymentMethod.toUpperCase()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Authorizer</span><span>{expense.authorizer || '—'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><span style={{ fontWeight: 700, color: '#ff6b35' }}>ksh {Number(subtotal).toFixed(2)}</span></div>
              </div>
            </div>

            <div className="table-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1f2e', marginBottom: '12px' }}>Payment Method</div>
              {['cash', 'card', 'cheque'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 13, marginBottom: 10, cursor: 'pointer' }}>
                  <input type="radio" name="paymentMethod" value={method} checked={expense.paymentMethod === method} onChange={handleExpenseChange} />
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </label>
              ))}
              {expense.paymentMethod === 'cheque' && (
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', marginBottom: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cheque Number</label>
                  <input type="text" name="chequeNumber" value={expense.chequeNumber} onChange={handleExpenseChange} className="filter-input" placeholder="Enter cheque number" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">Expense History</div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{history.length} records</span>
          </div>
        </div>
        {history.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No expense records yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Title</th>
                <th>Supplier</th>
                <th className="text-right">Items</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ color: '#ff6b35', fontWeight: 600 }}>{entry.id}</td>
                  <td style={{ color: '#6b7280' }}>{entry.date}</td>
                  <td>{entry.title}</td>
                  <td>{entry.supplierName}</td>
                  <td className="text-right">{entry.itemCount}</td>
                  <td className="text-right" style={{ fontWeight: 700, color: '#ff6b35' }}>ksh {Number(entry.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Expenses;
