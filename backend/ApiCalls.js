import express from "express";
import  apiKeyMiddleware from "./APISecurity.js";


const thriftly_url = 'https://thriftly-website.onrender.com';
const router = express.Router();


router.get("/docs", (req, res) => {
  res.redirect(`${thriftly_url}/docs`);
});

router.get("/products", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/products`);
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Products list from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details from Thriftly" });
    }
});

router.get("/products/:id", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/products/${req.params.id}`);
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Product details from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details from Thriftly" });
    }
});

router.get("/vendors", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result =  await fetch(`${thriftly_url}/vendors`);
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Vendors list from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor details from Thriftly" });
    }
});

router.get("/vendors/:id", apiKeyMiddleware(['backend','test']), async (req, res) => {
    try{
        const result = await fetch(`${thriftly_url}/vendors/${req.params.id}`);
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
            headers: {
                "Authorization": "Bearer thriftly-dev-token-2026",
                "Content-Type": "application/json"
            },
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
            headers: {
                "Authorization": "Bearer thriftly-dev-token-2026",
                "Content-Type": "application/json"
            }
        });
        res.status(result.status).json(await result.json());
        res.status(200).json({ message: "Purchase list from Thriftly fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase list from Thriftly" });
    }
});

export default router;