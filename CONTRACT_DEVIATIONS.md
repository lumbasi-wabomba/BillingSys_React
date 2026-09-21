**API CONTRACT DEVIATIONS** 

SUMMARY

| ENDPOINT  | WHAT CHANGED  | REASON  |
| :---- | :---- | :---- |
| GET /products  | Response schema changed:  added warehouse and icon.  | Added warehouse → to ensure that campuscore gets the product from the right warehouse, icon →  to ensure when they are displaying the products they display the right image of the product |
| GET /insights/trends | Removed the since parameter  | To simplify the method on the client side. We used a LIMIT at the database level to get the top 20 , to simplify the GET query from the user  |
| GET /insights/products-bought-together | Removed the $ref and replaced it by inline schema  | The $ref was complex and to simplify it moved to inline schema  |
| PATCH /discounts/{product\_id} | Replaaced the id from use of sku to product\_id  | For consistency and also to simplify the request body from the user, who can just use the product id instead of again querying for the sku  |
|  |  |  |
