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

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", ProductsRouter);
app.use("/api/expenses", ExpenseRouter);
app.use("/api/invoices", InvoiceRouter);
app.use("/api/sales", SalesRouter);
app.use("/api/suppliers", SuppliersRouter);
app.use("/api/users", UsersRouter);
app.use("/api/customers", CustomerRouter);
app.use("/api/purchases", PurchaseRouter);


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Backend is running");
});

export default app;