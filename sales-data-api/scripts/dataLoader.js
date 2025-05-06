const fs = require('fs');
const csv = require('csv-parser');
const { Customer, Product, Order, OrderItem } = require('../models');
const logger = require('../utils/logger');

async function loadData(csvPath, append = false) {
  try {
    if (!append) {
      await OrderItem.destroy({ where: {}, truncate: true });
      await Order.destroy({ where: {}, truncate: true });
      await Product.destroy({ where: {}, truncate: true });
      await Customer.destroy({ where: {}, truncate: true });
      logger.info('Cleared existing data');
    }

    const stream = fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          // Process customer
          await Customer.upsert({
            customer_id: row['Customer ID'],
            name: row['Customer Name'],
            email: row['Customer Email'],
            address: row['Customer Address']
          });

          // Process product
          await Product.upsert({
            product_id: row['Product ID'],
            product_name: row['Product Name'],
            category: row['Category'],
            unit_price: parseFloat(row['Unit Price'])
          });

          // Process order
          await Order.upsert({
            order_id: row['Order ID'],
            customer_id: row['Customer ID'],
            date_of_sale: new Date(row['Date of Sale']),
            payment_method: row['Payment Method'],
            shipping_cost: parseFloat(row['Shipping Cost'])
          });

          // Process order item
          await OrderItem.create({
            order_id: row['Order ID'],
            product_id: row['Product ID'],
            quantity_sold: parseInt(row['Quantity Sold']),
            discount: parseFloat(row['Discount']),
            region: row['Region']
          });
        } catch (error) {
          logger.error(`Error processing row: ${error.message}`);
        }
      })
      .on('end', () => {
        logger.info('Data loading completed');
      });

    return { success: true, message: 'Data loading started' };
  } catch (error) {
    logger.error(`Data loading failed: ${error.message}`);
    throw error;
  }
}

module.exports = loadData;