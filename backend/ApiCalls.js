import express from "express";
import  apiKeyMiddleware from "./APISecurity.js";


const thriftly_url = 'https://thriftly-website.onrender.com';
const thriftly_api_key = process.env.THRIFTLY_API_KEY;
const thriftly_headers = {
    "x-api-key": `${thriftly_api_key}`,
    "Content-Type": "application/json"
};

const router = express.Router();


router.get("/docs", (req, res) => {
  res.redirect(`${thriftly_url}/docs`);
});

router.get("/products", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/products`, { headers: thriftly_headers });
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Products list from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details from Thriftly" });
    }
});

router.get("/products/:id", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/products/${req.params.id}`, { headers: thriftly_headers });
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Product details from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details from Thriftly" });
    }
});

router.get("/vendors", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result =  await fetch(`${thriftly_url}/vendors`, { headers: thriftly_headers });
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Vendors list from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor details from Thriftly" });
    }
});

router.get("/vendors/:id", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/vendors/${req.params.id}`, { headers: thriftly_headers });
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Vendor details from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor details from Thriftly" });
    }
});
router.post("/purchases", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/purchases`, {
            method: "POST",
            headers: thriftly_headers,
            body: JSON.stringify(req.body)
        });
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Purchase request submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting purchase request" });
    }
});

router.get("/purchases", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/purchases`, {
            method: "GET",
            headers: thriftly_headers
        });
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Purchase list from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase list from Thriftly" });
    }
});

export default router;