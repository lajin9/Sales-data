# Sales Data API

This is a backend API project that provides endpoints to analyze sales data, including total revenue, revenue by product, category, and region.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repository.git
------------------------------------------------------------

EndPoints: 

/api/revenue/total: Get total revenue

/api/revenue/by-product: Get revenue by product

/api/revenue/by-category: Get revenue by category

/api/revenue/by-region: Get revenue by region

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
