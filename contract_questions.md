### Contract Questions

Reviewed against our needs: retrieving supplier info (name, address, email, phone, speciality), pulling new product info into our catalog (name, brand, price), and reading purchase trend data (brand, quantity, price, name) to adjust our internal systems.

## Vendor.market / Vendor.category vs. our need for address + speciality
  Where: Vendor schema  used by 
  GET /vendors and GET /vendors/{id}

  The schema has market (e.g. "Gikomba") and category (a fixed enum: Vintage, Streetwear, Kids, Accessories, Bulk)  but no address or speciality field.
  We need a real address to route a restocking contact, and a speciality to know what a vendor is actually known for beyond a fixed category bucket.
  
  Question: Is there a plan to add address and speciality as their own fields? If not, how are we meant to derive an address and a speciality from market and category as they stand today?

## Product has no brand field
  Where: Product schema  
  GET /products, GET /products/{id}

  The schema includes name, category, price, currency, and quantityAvailable  but no brand field anywhere.
  When onboarding an entirely new product into our database, brand is one of the three fields we need (alongside name and price).
  
  Question: Is brand missing intentionally, or an oversight in the current draft? If intentional, where should brand information come from instead?

## No read endpoint for purchase data
  Where:
  /purchases POST /purchases lets us create a purchase confirmation, but there's no corresponding GET /purchases (or similar) anywhere in the contract. We have no way to retrieve past purchases by vendor, product, or time range to build the trend data (brand, quantity, price, name over time) we need.

  Question: Is a read endpoint for purchase history planned? If trend data is meant to come from somewhere else entirely, where should we be pulling it from instead?
