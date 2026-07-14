// import React, { useState } from 'react';
// import '../App.css';
// import { products } from './Products';

// export default function POS() {
//   const [cart, setCart] = useState([]);

//   const addToCart = (p) => {
//     setCart(prev => {
//       const existing = prev.find(c => c.id === p.id);
//       if (existing) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
//       return [...prev, { ...p, qty: 1 }];
//     });
//   };

//   const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

//   const total = cart.reduce((acc, c) => acc + parseFloat(String(c.price).replace(/[^0-9.]/g, '')) * c.qty, 0);

//   return (
//     <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
//       <div className="table-card">
//         <div className="table-card-header"><div className="table-card-title">Products</div></div>
//         <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
//           {products.map(p => (
//             <div key={p.id} onClick={() => addToCart(p)} style={{
//               border: '1px solid var(--border)', borderRadius: 10, padding: 14, cursor: 'pointer', textAlign: 'center'
//             }}>
//               <div style={{ fontSize: 36, marginBottom: 8 }}>{p.icon}</div>
//               <div style={{ fontWeight: 600, fontSize: 12.5 }}>{p.name}</div>
//               <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>{p.price}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="table-card">
//         <div className="table-card-header"><div className="table-card-title">Cart</div></div>
//         <div style={{ padding: 16 }}>
//           {cart.length === 0 ? (
//             <div style={{ color: '#9ca3af', textAlign: 'center', padding: 24 }}>Cart is empty</div>
//           ) : (
//             <>
//               {cart.map(c => (
//                 <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
//                     <div style={{ fontSize: 12, color: '#6b7280' }}>{c.qty} × {c.price}</div>
//                   </div>
//                   <button className="btn btn-outline btn-sm" onClick={() => removeFromCart(c.id)}>✕</button>
//                 </div>
//               ))}
//               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 800, fontSize: 16 }}>
//                 <span>Total</span><span>KSh {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//               </div>
//               <button className="btn btn-primary" style={{ width: '100%' }}>Checkout</button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }