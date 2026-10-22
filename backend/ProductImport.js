import express from "express";
import db from "./db.js";

const router = express.Router();
const DEFAULT_MARKUP = 1.2;

const mapProduct = (product) => {
  const bp = Number(product.price);
  const externalId = String(product.id ?? "").trim();

  return {
    externalId,
    sku: `EXT-${externalId}`,
    name: String(product.name || "").trim(),
    category: String(product.category || "").trim(),
    brand: String(product.brand || "").trim(),
    unit: "piece",
    bp,
    sp: Number((bp * DEFAULT_MARKUP).toFixed(2)),
    quantity: Number(product.quantityAvailable ?? 0),
    minqty: 0,
    warehouse: "External",
  };
};

router.post("/", async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : req.body?.data;

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      error: "Send product data as an array or as { data: [] }.",
    });
  }

  const products = records.map(mapProduct);
  const invalid = products
    .map((product, index) => {
      const errors = [];

      if (!product.sku || product.sku.length > 20) {
        errors.push("id is required and must produce a SKU of at most 20 characters");
      }
      if (!product.name || product.name.length > 50) {
        errors.push("name is required and must be at most 50 characters");
      }
      if (!product.category || product.category.length > 25) {
        errors.push("category is required and must be at most 25 characters");
      }
      if (!product.brand || product.brand.length > 50) {
        errors.push("brand is required and must be at most 50 characters");
      }
      if (!Number.isFinite(product.bp) || product.bp <= 0) {
        errors.push("price must be greater than zero");
      }
      if (!Number.isInteger(product.quantity) || product.quantity < 0) {
        errors.push("quantityAvailable must be a non-negative integer");
      }

      return { index, errors };
    })
    .filter((record) => record.errors.length > 0);

  if (invalid.length > 0) {
    return res.status(400).json({
      error: "Some product records do not match the database schema.",
      invalid,
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const imported = [];
    const expenses = [];

    for (const product of products) {
      const result = await client.query(
        `INSERT INTO products
          (name, sku, category, brand, unit, sp, bp, quantity, minqty, warehouse)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (sku) DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           brand = EXCLUDED.brand,
           unit = EXCLUDED.unit,
           sp = EXCLUDED.sp,
           bp = EXCLUDED.bp,
           quantity = EXCLUDED.quantity,
           minqty = EXCLUDED.minqty,
           warehouse = EXCLUDED.warehouse
         RETURNING *`,
        [
          product.name,
          product.sku,
          product.category,
          product.brand,
          product.unit,
          product.sp,
          product.bp,
          product.quantity,
          product.minqty,
          product.warehouse,
        ]
      );
      const savedProduct = result.rows[0];
      imported.push(savedProduct);

      const expenseResult = await client.query(
        `INSERT INTO expenses
          (payment_method, items, total, notes, product)
         VALUES ($1, $2::jsonb, $3, $4, $5)
         RETURNING *`,
        [
          "cash",
          JSON.stringify([
            {
              product_id: savedProduct.id,
              product_name: savedProduct.name,
              quantity: product.quantity,
              unit_cost: product.bp,
              total: Number((product.bp * product.quantity).toFixed(2)),
            },
          ]),
          Number((product.bp * product.quantity).toFixed(2)),
          `External product purchase; external product ID: ${product.externalId}`,
          savedProduct.id,
        ]
      );
      expenses.push(expenseResult.rows[0]);
    }

    await client.query("COMMIT");
    return res.status(201).json({
      message: `${imported.length} product(s) imported successfully.`,
      markup: "20%",
      products: imported,
      expenses,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
