// import express from "express";
// import cors from "cors";
// import ProductsRouter from "./Products.js";
// import ExpenseRouter from "./Expense.js";
// import InvoiceRouter from "./Invoice.js";
// import SalesRouter from "./Sales.js";
// import SuppliersRouter from "./Suppliers.js";
// import UsersRouter from "./Users.js";
// import CustomerRouter from "./Customer.js";
// import PurchaseRouter from "./Purchase.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/products", ProductsRouter);
// app.use("/api/expenses", ExpenseRouter);
// app.use("/api/invoices", InvoiceRouter);
// app.use("/api/sales", SalesRouter);
// app.use("/api/suppliers", SuppliersRouter);
// app.use("/api/users", UsersRouter);
// app.use("/api/customers", CustomerRouter);
// app.use("/api/purchases", PurchaseRouter);


// const PORT = 3001;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// app.get("/", (req, res) => {
//     res.send("Backend is running");
// });

// export default app;



import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import ProductsRouter from "./Products.js";
import ExpenseRouter from "./Expense.js";
import InvoiceRouter from "./Invoice.js";
import SalesRouter from "./Sales.js";
import SuppliersRouter from "./Suppliers.js";
import UsersRouter from "./Users.js";
import CustomerRouter from "./Customer.js";
import PurchaseRouter from "./Purchase.js";
import DiscountRouter from "./Discounts.js";
import InsightRouter from "./Insights.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/products", ProductsRouter);
app.use("/api/expenses", ExpenseRouter);
app.use("/api/invoices", InvoiceRouter);
app.use("/api/sales", SalesRouter);
app.use("/api/suppliers", SuppliersRouter);
app.use("/api/users", UsersRouter);
app.use("/api/customers", CustomerRouter);
app.use("/api/purchases", PurchaseRouter);
app.use("/api/discounts", DiscountRouter);
app.use("/api/insights", InsightRouter);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized error handler. Any error that a route does not catch ends up
// here, and we always return a readable message (never a blank error).
app.use((err, req, res, next) => {
  // Log the full error for us developers to debug.
  console.error(err);

  let status = err.status || 500;
  let message = "Something went wrong on the server.";

  // Give a proper message even when the error object has no message at all.
  if (err && err.message) {
    message = err.message;
  }

  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;