import express from "express";
import db from "./db.js";

const router = express.Router();
const MARKUP = 1.2;

router.post("/", async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : req.body?.data;

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: "Send product data as an array." });
  }

  for (const p of records) {
    const quantity = Number(p.quantityAvailable || 0);
    if (!p.id || !p.name || !p.category || !p.brand) {
      return res.status(400).json({ error: "id, name, category and brand are required." });
    }
    if (!(Number(p.price) > 0)) {
      return res.status(400).json({ error: "price must be greater than zero." });
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ error: "quantityAvailable must be a non-negative integer." });
    }
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const imported = [];
    const expenses = [];

    for (const p of records) {
      const sku = `EXT-${p.id}`;
      const bp = Number(p.price);
      const sp = Number((bp * MARKUP).toFixed(2));
      const quantity = Number(p.quantityAvailable || 0);
      const total = Number((bp * quantity).toFixed(2));

      // Insert the product, or update it if the SKU already exists
      const productResult = await client.query(
        `INSERT INTO products
          (name, sku, category, brand, unit, sp, bp, quantity, minqty, warehouse)
         VALUES ($1, $2, $3, $4, 'piece', $5, $6, $7, 0, 'External')
         ON CONFLICT (sku) DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           brand = EXCLUDED.brand,
           sp = EXCLUDED.sp,
           bp = EXCLUDED.bp,
           quantity = EXCLUDED.quantity
         RETURNING *`,
        [p.name, sku, p.category, p.brand, sp, bp, quantity]
      );
      const product = productResult.rows[0];
      imported.push(product);

      const items = [
        {
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_cost: bp,
          total,
        },
      ];

      const expenseResult = await client.query(
        `INSERT INTO expenses (payment_method, items, total, notes, product)
         VALUES ('cash', $1::jsonb, $2, $3, $4)
         RETURNING *`,
        [
          JSON.stringify(items),
          total,
          `External product purchase; external product ID: ${p.id}`,
          product.id,
        ]
      );
      expenses.push(expenseResult.rows[0]);
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: `${imported.length} product(s) imported successfully.`,
      markup: "20%",
      products: imported,
      expenses,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;