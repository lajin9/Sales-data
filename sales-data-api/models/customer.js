const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.TEXT,
}, {
  timestamps: false,
  tableName: 'customers'
});

module.exports = Customer;