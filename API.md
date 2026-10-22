# Billing System API

## Overview

The Billing System API provides RESTful services for managing product inventories, applying discounts, and retrieving product analytics and insights. It is intended for developers and integrators who need to view product catalogs, manage dynamic pricing discounts, and track customer engagement metrics such as product views and trends.

## Base URL

```text
http://localhost:3001/api
```

## Authentication

Public access is currently available for demonstration purposes. To simulate the production security model, send a bearer token with each request:

```http
Authorization: Bearer <your_token_here>
```

## Quickstart

Retrieve the list of products:

```bash
curl -X GET "http://localhost:3001/api/products" \
  -H "Authorization: Bearer demo-token" \
  -H "Accept: application/json"
```

## Endpoints

### Products

#### Get All Products

```http
GET /api/products
```

```bash
curl -X GET "http://localhost:3001/api/products" \
  -H "Accept: application/json"
```

**Response: `200 OK`**

```json
[
  {
    "id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
    "icon": "https://example.com/icons/widget.png",
    "name": "Super Widget",
    "sku": "WIDGET-001",
    "category": "Electronics",
    "brand": "Acme",
    "unit": "piece",
    "sp": 49.99,
    "quantity": 100,
    "warehouse": "Main Warehouse"
  }
]
```

#### Get Product by ID

```http
GET /api/products/{product_id}
```

```bash
curl -X GET "http://localhost:3001/api/products/e3b0c442-98fc-11ee-b9d1-0242ac120002" \
  -H "Accept: application/json"
```

**Response: `200 OK`**

```json
{
  "id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
  "icon": "https://example.com/icons/widget.png",
  "name": "Super Widget",
  "sku": "WIDGET-001",
  "category": "Electronics",
  "brand": "Acme",
  "unit": "piece",
  "sp": 49.99,
  "quantity": 100,
  "warehouse": "Main Warehouse"
}
```

### Discounts

#### List All Discounts

```http
GET /api/discounts
```

```bash
curl -X GET "http://localhost:3001/api/discounts" \
  -H "Accept: application/json"
```

**Response: `200 OK`**

```json
[
  {
    "id": "7a9b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
    "product_id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
    "amount": 10.00,
    "start_date": "2026-10-01T00:00:00Z",
    "end_date": "2026-10-31T23:59:59Z",
    "updated_at": "2026-10-01T08:00:00Z"
  }
]
```

#### Update Discount by Product ID

```http
PATCH /api/discounts/{product_id}
Content-Type: application/json
```

```bash
curl -X PATCH "http://localhost:3001/api/discounts/e3b0c442-98fc-11ee-b9d1-0242ac120002" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "amount": 15.50,
    "start_date": "2026-10-12T09:00:00Z"
  }'
```

**Response: `200 OK`**

```json
{
  "id": "7a9b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
  "product_id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
  "amount": 15.50,
  "start_date": "2026-10-12T09:00:00Z",
  "end_date": "2026-10-31T23:59:59Z",
  "updated_at": "2026-10-12T09:11:00Z"
}
```

### Insights

#### Create Product View Insight

```http
POST /api/insights
Content-Type: application/json
```

```bash
curl -X POST "http://localhost:3001/api/insights" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "product_id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
    "total_views": 1
  }'
```

**Response: `201 Created`**

```json
{
  "id": "9f8e7d6c-5b4a-3f2e-1d0c-b9a8f7e6d5c4",
  "product_id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
  "total_views": 1
}
```

#### Retrieve Trends Data

```http
GET /api/insights/trends
```

```bash
curl -X GET "http://localhost:3001/api/insights/trends" \
  -H "Accept: application/json"
```

**Response: `200 OK`**

```json
[
  {
    "id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
    "name": "Super Widget",
    "viewCount": 150,
    "unitsSold": "42"
  }
]
```

#### Retrieve Products Bought Together

```http
GET /api/insights/products-bought-together
```

```bash
curl -X GET "http://localhost:3001/api/insights/products-bought-together" \
  -H "Accept: application/json"
```

**Response: `200 OK`**

```json
[
  {
    "cart": [
      {
        "id": "e3b0c442-98fc-11ee-b9d1-0242ac120002",
        "sku": "WIDGET-001",
        "name": "Super Widget",
        "price": 49.99,
        "quantity": 2
      }
    ],
    "i_date": "2026-10-12T09:11:00Z"
  }
]
```

## Error Format

Failed requests return a standard HTTP error status and a JSON object containing an `error` message:

```json
{
  "error": "Description of the failure"
}
```

### Product Not Found

**Response: `404 Not Found`**

```bash
curl -X GET "http://localhost:3001/api/products/00000000-0000-0000-0000-000000000000" \
  -H "Accept: application/json"
```

```json
{
  "error": "Product not found"
}
```

### Invalid Discount Update

**Response: `400 Bad Request`**

```bash
curl -X PATCH "http://localhost:3001/api/discounts/e3b0c442-98fc-11ee-b9d1-0242ac120002" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{}'
```

```json
{
  "error": "Invalid input, no valid fields provided for update"
}
```

## Run the API Locally

### Prerequisites

- Node.js 18 or later, or Node.js 24 to match the Docker build
- A Neon PostgreSQL database
- Git

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/lumbasi-wabomba/BillingSys_React.git
   cd BillingSys_React
   npm install
   cd backend
   npm install
   cd ..
   ```

2. Create a `.env` file in the project root with your Neon PostgreSQL connection details.

3. Start the backend server:

   ```bash
   cd backend
   node dbServer.js
   ```

   The API listens on `http://localhost:3001`.

4. Start the frontend in a separate terminal:

   ```bash
   cd BillingSys_React
   npm start
   ```

   The React application opens at `http://localhost:3000` and proxies API calls to `http://localhost:3001/api/*`.

   ### Import external suppliers

   Import supplier records through `POST /api/integrations/suppliers`. The endpoint accepts
   an array or an object containing a `data` array. External fields are mapped as
   follows:

   - `market` becomes `address`
   - `category` becomes `speciality`

   ```bash
   curl -X POST "http://localhost:3001/api/integrations/suppliers" \
     -H "Content-Type: application/json" \
     -d '[
       {
         "id": 2,
         "name": "Fresh Threads KE",
         "category": "Streetwear",
         "market": "Gikomba Market",
         "phone": "+254798001234",
         "email": "freshthreads@example.com",
         "verified": true
       }
     ]'
   ```

   ### Import external purchases

   The database stores purchases in the `expenses` table. Import purchases through
   `POST /api/integrations/purchases`. The database generates its own UUIDs.
   External vendor and product IDs are retained as metadata because numeric
   external IDs cannot be used as this system's UUID foreign keys.

   ```json
   {
     "data": [
       {
         "referenceNumber": "THR-PC-8F8F3C94",
         "vendorId": 5,
         "productId": 9,
         "quantity": 1,
         "totalAmount": 1800,
         "currency": "KES",
         "status": "confirmed",
         "createdAt": "2026-10-12T06:29:23Z"
       }
     ]
   }
   ```

   ### Import external products

   Import products through `POST /api/integrations/products`. The external
   `price` is stored as the buying price (`bp`), and the selling price (`sp`) is
   calculated using the default 20% markup.

   ```json
   {
     "data": [
       {
         "id": 1,
         "vendorId": 1,
         "name": "Denim Jacket, Size M",
         "category": "Vintage",
         "brand": "Levi's",
         "price": 750,
         "currency": "KES",
         "quantityAvailable": 3
       }
     ]
   }
   ```

   The importer generates `sku`, uses `piece` as the unit, uses `External` as the
   warehouse, and sets `minqty` to `0`. It also creates a matching summary in the
   `expenses` table using `price * quantityAvailable` as the purchase total. For
   the example above, `bp` is `750.00`, `sp` is `900.00`, and the expense total is
   `2250.00`.
