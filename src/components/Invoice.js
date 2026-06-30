// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Invoice() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [customerName, setCustomerName] = useState("");
// const [customerNumber, setCustomerNumber] = useState("");
// const [search, setSearch] = useState("");
// const filteredProducts = products.filter(p =>
//   p.name.toLowerCase().includes(search.toLowerCase())
// );
// const removeFromCart = (index) => {
//   const newCart = [...cart];





//   if (newCart[index].quantity > 1) {
//     newCart[index].quantity -= 1;
//   } else {
//     newCart.splice(index, 1);
//   }

//   setCart(newCart);
// };
//   // load products
//   useEffect(() => {
//     fetch("http://localhost:3002/products")
//       .then(res => res.json())
//       .then(data => setProducts(data));
//   }, []);

//   // add to invoice
//   const addToCart = (product) => {
//   const existing = cart.find(item => item.product_id === product.product_id);

//   if (existing) {
//     const updatedCart = cart.map(item =>
//       item.product_id === product.product_id
//         ? { ...item, quantity: item.quantity + 1 }
//         : item
//     );
//     setCart(updatedCart);
//   } else {
//     setCart([...cart, { ...product, quantity: 1 }]);
//   }
// };

//   // calculate total
//   const total = cart.reduce((sum, item) => {
//   return sum + item.price * item.quantity;
// }, 0);

// const saveInvoice = () => {
//   fetch("http://localhost:3002/invoices", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       customerName,
//       customerNumber,
//       cart,
//       total
//     })
//   })
//     .then(res => res.json())
//     .then(data => {
//       console.log("SAVED:", data);
//       setCart([]);
//       setCustomerName("");
//       setCustomerNumber("");
//     })
//     .catch(err => console.log(err));
// };

// console.log("SEARCH VALUE:", search);
//   return (
//   <div className="invoice-page">

//     {/* CUSTOMER SECTION */}
//     <div className="card">
//       <h3>Customer Details</h3>

//       <input
//         placeholder="Customer Name"
//         onChange={(e) => setCustomerName(e.target.value)}
//       />

//       <input
//         placeholder="Customer Number"
//         onChange={(e) => setCustomerNumber(e.target.value)}
//       />
//     </div>

//     {/* SEARCH SECTION */}
//     <div className="card">
//       <h3>Search Product</h3>

//       <input
//         placeholder="Search by product name..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//     </div>

//     {/* PRODUCTS SECTION */}
//     <div className="card">
//       <h3>Products</h3>

//       {filteredProducts.map(p => (
//         <div key={p.product_id}>
//           {p.name} - {p.price}
//           <button onClick={() => addToCart(p)}>
//             Add
//           </button>
//         </div>
//       ))}
//     </div>

//     {/* CART SECTION */}
//     <div className="card">
//       <h3>Cart</h3>

//       {cart.map((item, index) => (
//         <div key={item.product_id || index}>
//           {item.name} - {item.price} × {item.quantity} ={" "}
//           {item.price * item.quantity}

//           <button onClick={() => removeFromCart(index)}>
//             Remove
//           </button>
//         </div>
//       ))}
//     </div>

//     {/* TOTAL AND ACTIONS SECTION */}
//     <div className="card">
//       <h2>Total: {total}</h2>

//       <button onClick={saveInvoice}>
//         Save Invoice
//       </button>

//       <button onClick={() => navigate("/invoice-history")}>
//         Invoice History
//       </button>
//     </div>

//   </div>
// );
// }

// export default Invoice;