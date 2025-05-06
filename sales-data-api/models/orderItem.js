const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const OrderItem = sequelize.define('OrderItem', {
  order_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: 'orders',
      key: 'order_id'
    }
  },
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: 'products',
      key: 'product_id'
    }
  },
  quantity_sold: DataTypes.INTEGER,
  discount: DataTypes.DECIMAL(5, 2),
  region: DataTypes.STRING,
}, {
  timestamps: false,
  tableName: 'order_items'
});

module.exports = OrderItem;