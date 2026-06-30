// import React, { useEffect, useState } from "react";

// function InvoiceHistory() {
//   const [invoices, setInvoices] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3002/invoices")
//       .then(res => res.json())
//       .then(data => setInvoices(data));
//   }, []);

//  return (
//   <div className="history-page">

//     <h2>Invoice History</h2>

//     <div className="history-grid">
//       {invoices.map(inv => (
//         <div key={inv.invoice_id} className="history-card">

//           <p><b>Invoice ID:</b> {inv.invoice_id}</p>
//           <p><b>Customer:</b> {inv.customer_name}</p>
//           <p><b>Number:</b> {inv.customer_number}</p>
//           <p><b>Total:</b> {inv.total_amount}</p>
//           <p><b>Date:</b> {inv.invoice_date}</p>

//         </div>
//       ))}
//     </div>

//   </div>
// );
// }

// export default InvoiceHistory;