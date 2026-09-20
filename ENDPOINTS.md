# Endpoint List — Billing/POS (Producer, for CampusCore)

| Method | Path | Purpose | Maps to Need |
|--------|------|---------|---------------|
| GET | /products | Return the whole list of products | "CampusCore needs to retrieve the whole list of products in order to list them in its app." |
| GET | /products/{sku} | Return specific product info | "CampusCore needs to retrieve specific product information in order to show more info when a buyer clicks on a product." |
| GET | /insights/trends | Return product market trend stats | "CampusCore needs to retrieve product trends in order to display the most trending products." |
| GET | /insights/products-bought-together | Return product recommendation data | "CampusCore needs to retrieve products bought together in order to provide recommendations." |
| PATCH | /discounts/{sku}/amount | Update the discount amount for a product | "CampusCore needs to set the discount amount per item in order to manage promotions on its platform." |
| POST | /insights/ | Record a view event for a product | "CampusCore needs to record a view per product in order to feed product market trend data." |
