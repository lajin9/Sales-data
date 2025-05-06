Url: http://localhost:3000/api

------------------------------------------------------------
database structure: 

CUSTOMERS
---------
customer_id (PK)
name
email
address

PRODUCTS
--------
product_id (PK)
product_name
category
unit_price

ORDERS
------
order_id (PK)
customer_id (FK to CUSTOMERS)
date_of_sale
payment_method
shipping_cost

ORDER_ITEMS
-----------
order_id (FK to ORDERS)
product_id (FK to PRODUCTS)
quantity_sold
discount
region
------------------------------------------------------------
