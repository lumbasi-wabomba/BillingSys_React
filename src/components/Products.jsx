import React, { useEffect, useState } from "react";
import '../App.css';
function Products() {
  // ✅ ALL STATES FIRST
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    fetch("http://localhost:3002/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Fetch error on load:", err));
  }, []);

  // HELPER TO RESET FORM
  const handleCloseForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setShowForm(false);
  };

  // ✅ ADD PRODUCT FUNCTION
  const addProduct = () => {
    // Quick validation check
    if (!name || !price || !stock) {
      alert("Please fill out all fields before saving!");
      return;
    }

    fetch("http://localhost:3002/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        quantity_in_stock: parseInt(stock, 10)
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        // Refresh list after successful add
        return fetch("http://localhost:3002/products");
      })
      .then(res => res.json())
      .then(result => {
        setProducts(result);
        handleCloseForm(); // ✅ Correctly closes and resets form
      })
      .catch(err => {
        // Look here in your browser console if it fails!
        console.error("Error inside addProduct:", err);
        alert("Failed to save product. Check console logs for details.");
      });
  };

  return (
  <div className="products-page">

    {/* HEADER */}
    <div className="products-header">
      <h2>Products</h2>

      <button onClick={() => setShowForm(true)}>
        + Add Product
      </button>
    </div>

    {/* POPUP FORM */}
    {showForm && (
      <div>
        <h3>Add Product</h3>

        <input 
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />

        <input 
          placeholder="Price" 
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)} 
        />

        <input 
          placeholder="Stock" 
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)} 
        />

        <button onClick={addProduct}>Save</button>
        <button onClick={handleCloseForm}>Cancel</button>
      </div>
    )}

    {/* PRODUCT TABLE */}
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity in Stock</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p) => (
          <tr key={p.product_id || p.id}>
            <td>{p.name}</td>
            <td>${p.price}</td>
            <td>{p.quantity_in_stock} units</td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>
);
}

export default Products;