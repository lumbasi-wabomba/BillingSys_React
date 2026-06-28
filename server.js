const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

////////////////////////////////////////////////////////////////

app.get("/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

app.post("/products", (req, res) => {
    const { name, price, quantity_in_stock } = req.body;

    const sql = `
        INSERT INTO products (name, price, quantity_in_stock)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, price, quantity_in_stock], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({ message: "Product added successfully" });
    });
});


///////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
app.get("/invoices", (req, res) => {
    
    const sql = "SELECT * FROM invoices ORDER BY invoice_id DESC";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json(result);
    });
});

app.get("/invoices/:id", (req, res) => {
    const invoiceId = req.params.id;

    const sql = `
        SELECT i.*, p.name
        FROM invoice_items i
        JOIN products p ON i.product_id = p.product_id
        WHERE i.invoice_id = ?
    `;

    db.query(sql, [invoiceId], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json(result);
    });
});
//////////////////////////////////////////////////////////////////


app.post("/invoices", (req, res) => {
console.log(req.body);
    const { customerName, customerNumber, cart, total } = req.body;

    const invoiceSql = `
        INSERT INTO invoices
        (customer_name, customer_number, total_amount)
        VALUES (?, ?, ?)
    `;

    db.query(
        invoiceSql,
        [customerName, customerNumber, total],
        (err, result) => {

            if (err) return res.status(500).json(err);

            const invoiceId = result.insertId;

            const itemSql = `
                INSERT INTO invoice_items
                (invoice_id, product_id, quantity, unit_price, subtotal)
                VALUES ?
            `;

            const values = cart.map(item => [
                invoiceId,
                item.product_id,
                item.quantity,                  // save the actual quantity
                item.price,
                item.price * item.quantity      // correct subtotal
            ]);

            db.query(itemSql, [values], (err2) => {

                if (err2) return res.status(500).json(err2);

                res.json({
                    message: "Invoice saved successfully",
                    invoiceId
                });

            });

        }
    );

});

//////////////////////////////////////////////////////////////


//////////////////////////////////////////////////

app.listen(3002, () => {
  console.log("🚀 Server running on port 3002");
});