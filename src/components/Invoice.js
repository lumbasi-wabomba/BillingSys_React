import React, { useState } from 'react';
import '../App.css'; // You can handle all your styling here or in a dedicated CSS file!

function Invoice() {
  // State variables for Customer Details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  // State variable for the items in the bill
  const [cart, setCart] = useState([
    { id: 1, name: 'Cemex Cement 50kg', quantity: 1, price: 850 },
    { id: 2, name: 'PPR Pipe 20mm', quantity: 2, price: 320 }
  ]);

  // Update item quantity dynamically
  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Number(newQty) } : item));
  };

  // Calculate total amount automatically
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const triggerPayment = (e) => {
    e.preventDefault();
    alert(`Initiating M-Pesa STK Push for KES ${totalAmount} to ${phone}`);
  };

  return (
    <div className="invoice-page">
      <h2>New Retail Invoice</h2>
      
      {/* Customer Information Inputs */}
      <div className="customer-info-section">
        <input 
          type="text" 
          placeholder="Customer Name" 
          value={customerName} 
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder="M-Pesa Number (e.g., 07...)" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Items Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price (KES)</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
              </td>
              <td>{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Checkout Section */}
      <div className="checkout-summary">
        <h3>Grand Total: KES {totalAmount}</h3>
        <button onClick={triggerPayment}>
          Pay with M-Pesa
        </button>
      </div>
    </div>
  );
}

export default Invoice;