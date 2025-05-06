const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.STRING,
    references: {
      model: 'customers',
      key: 'customer_id'
    }
  },
  date_of_sale: DataTypes.DATEONLY,
  payment_method: DataTypes.STRING,
  shipping_cost: DataTypes.DECIMAL(10, 2),
}, {
  timestamps: false,
  tableName: 'orders'
});

module.exports = Order;