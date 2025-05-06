const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_name: DataTypes.STRING,
  category: DataTypes.STRING,
  unit_price: DataTypes.DECIMAL(10, 2),
}, {
  timestamps: false,
  tableName: 'products'
});

module.exports = Product;