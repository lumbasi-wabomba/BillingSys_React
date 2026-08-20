
## TEAM FIVE
Evaline Wanjiru - Integration/QA Lead
Wayne Baraka - Docs/DevOps Lead
Kepha Lumbasi - Backend Dev
Prince Mumo- API Lead

## 2. Summary 
Our application is a billing management system designed to help businesses manage their sales and invoicing processes. It allows users to manage products, create invoices, record customer information, and calculate transaction totals. The application is intended for businesses and employees who need a simple way to manage sales and keep track of customer transactions.

## 3. Part B Audit

### Resources

1. **Customers**
   - Key fields: name, phone, email, no_of_orders

2. **Products**
   - Key fields: name, sku, category, brand, unit, sp (sell price), bp (buy price), quantity, minqty, warehouse

3. **Suppliers**
   - Key fields: name, address, email, phone, speciality, authorizer

4. **Invoices**
   - Key fields: customer_id, supplier_id, cart, total, i_date, status

5. **Expenses**
   - Key fields: e_date, payment_method, mpesa_code, cheque_no, items, total, notes, supplier, product, authorizer

6. **Users (staff)**
   - Key fields: name, role, emp_date, salary, phone, email

### Actions

**Customers**
- Create customer
- View list/detail
- Edit details
- Delete
- Search by name/phone/email
- View order history/count

**Products**
- Create product
- View list/detail
- Edit
- Delete
- Search/filter by category, brand, warehouse
- Adjust quantity (stock in/out)
- Update sale/buy price
- Flag low stock (quantity < minqty)

**Suppliers**
- Create supplier
- View list/detail
- Edit
- Delete
- Search by speciality
- Assign/change authorizer

**Invoices**
- Create invoice (build cart)
- View list/detail
- Edit
- Cancel/delete
- Update status (pending -> paid/etc.)
- Search/filter by customer, supplier, status, date range
- Compute total

**Expenses**
- Create expense
- View list/detail
- Edit
- Delete
- Filter by payment method, supplier, product, date
- Record M-Pesa code / cheque number
- Approve/authorize
- Add notes

**Users (staff)**
- Create user
- View list/detail
- Edit
- Delete
- Assign role
- Search by role
- View salary and employment date

## 4. 
Team 6