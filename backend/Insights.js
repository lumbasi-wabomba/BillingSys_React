import express from "express";
import db from "./db.js";

const router = express.Router();

const allowedFields = ["product_id", "total_views"];

const getPayload = (body) => {
  const payload = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  });
  return payload;
};

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM product_views ORDER BY total_views DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const payload = getPayload(req.body);
  try {
    const result = await db.query(
      "INSERT INTO product_views (product_id, total_views) VALUES ($1, $2) ON CONFLICT (product_id) DO UPDATE SET total_views = product_views.total_views + $2 RETURNING *",
      [payload.product_id, payload.total_views]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/trends", async (req, res) => {
  try {
    const result = await db.query(
    `WITH cart_items AS (
    SELECT item->>'id' AS product_id,(item->>'quantity')::int AS quantity,(item->>'price')::numeric AS price
    FROM invoices,jsonb_array_elements(cart) AS item WHERE status = 'paid'),sales AS (
      SELECT product_id,SUM(quantity) AS units_sold FROM cart_items GROUP BY product_id) 
    SELECT p.id, p.name,COALESCE(v.total_views, 0) AS "viewCount",COALESCE(s.units_sold, 0) AS "unitsSold"
    FROM products p LEFT JOIN product_views v ON v.product_id = p.id LEFT JOIN sales s ON s.product_id = p.id::text
    ORDER BY "unitsSold" DESC, "viewCount" DESC LIMIT 20`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/products-bought-together", async (req, res) => {
    try{
      const result = await db.query("SELECT cart, i_date FROM invoices WHERE cart IS NOT NULL ORDER BY i_date DESC");
      res.json(result.rows);
    
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
    // console.log("Products bought together endpoint hit");
    // res.json({ message: "Products bought together endpoint hit" });
  
});

export default router;