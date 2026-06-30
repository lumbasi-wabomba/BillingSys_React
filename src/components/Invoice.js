import React, { useEffect, useState } from "react";
// Import the named products array directly from your team's file
import { products as originalProducts } from "./Products"; 

function Invoice({ navigate }) { 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [search, setSearch] = useState("");

  // Clean string prices ('$1,299' -> 1299) on mount so calculations don't return NaN
  useEffect(() => {
    if (originalProducts) {
      const cleanedProducts = originalProducts.map(p => {
        const numericPrice = typeof p.price === 'string' 
          ? parseFloat(p.price.replace(/[^0-9.-]+/g, "")) 
          : p.price;

        return {
          ...p,
          price: numericPrice || 0
        };
      });
      setProducts(cleanedProducts);
    }
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

  // Client-side saving using localStorage and redirection
  const saveInvoice = () => {
    if (!customerName.trim() || cart.length === 0) {
      alert("Please provide a customer name and add items to the cart.");
      return;
    }

    const newInvoice = {
      id: "inv_" + Date.now(),
      date: new Date().toLocaleDateString(),
      customerName,
      customerNumber,
      cart,
      total
    };

    try {
      const existingInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
      existingInvoices.push(newInvoice);
      localStorage.setItem("invoices", JSON.stringify(existingInvoices));

      alert("Invoice saved successfully!");
      
      // Clear current form state values
      setCart([]);
      setCustomerName("");
      setCustomerNumber("");

      // Redirect immediately to your Invoice History screen component case
      navigate("invoice-history"); 
    } catch (err) {
      console.error("Local Storage Error:", err);
      alert("Failed to save invoice locally.");
    }
  };

  return (
    <div className="invoice-page">

      {/* CUSTOMER SECTION */}
      <div className="card">
        <h3>Customer Details</h3>
        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          placeholder="Customer Number"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
        />
      </div>

      {/* SEARCH SECTION */}
      <div className="card">
        <h3>Search Product</h3>
        <input
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* PRODUCTS SECTION */}
      <div className="card">
        <h3>Products</h3>
        {filteredProducts.map(p => (
          <div key={p.id}>
            {p.icon} {p.name} - ${p.price.toFixed(2)}
            <button style={{ marginLeft: 10 }} onClick={() => addToCart(p)}>Add</button>
          </div>
        ))}
      </div>

      {/* CART SECTION */}
      <div className="card">
        <h3>Cart</h3>
        {cart.map((item) => (
          <div key={item.id}>
            {item.icon} {item.name} - ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            <button style={{ marginLeft: 10 }} onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      {/* TOTAL AND ACTIONS SECTION */}
      <div className="card">
        <h2>Total: ${total.toFixed(2)}</h2>
        <button onClick={saveInvoice}>Save Invoice</button>
        
        <button style={{ marginLeft: 10 }} onClick={() => navigate("invoice-history")}>
          Invoice History
        </button>
      </div>

    </div>
  );
}

export default Invoice;