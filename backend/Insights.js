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
  try{
    
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

  console.log("Trends endpoint hit");
  res.json({ message: "Trends endpoint hit" });
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