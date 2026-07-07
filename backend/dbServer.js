import express from "express";
import cors from "cors";
import ProductsRouter from "./Products.js";
import ExpenseRouter from "./Expense.js";
import InvoiceRouter from "./Invoice.js";
import SalesRouter from "./Sales.js";
import SuppliersRouter from "./Suppliers.js";
import UsersRouter from "./Users.js";
import CustomerRouter from "./Customer.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", ProductsRouter);
app.use("/expenses", ExpenseRouter);
app.use("/invoices", InvoiceRouter);
app.use("/sales", SalesRouter);
app.use("/suppliers", SuppliersRouter);
app.use("/users", UsersRouter);
app.use("/customers", CustomerRouter);

export default app;
