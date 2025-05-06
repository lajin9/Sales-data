exports.getRevenueByProduct = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereCondition = {};
    if (startDate && endDate) {
      whereCondition.date_of_sale = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const result = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: whereCondition,
          required: true
        },
        {
          model: Product,
          required: true
        }
      ],
      attributes: [
        'product_id',
        [sequelize.col('Product.product_name'), 'product_name'],
        [sequelize.literal('SUM(quantity_sold * Product.unit_price * (1 - OrderItem.discount))'), 'revenue']
      ],
      group: ['product_id', 'Product.product_name'],
      raw: true
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenueByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereCondition = {};
    if (startDate && endDate) {
      whereCondition.date_of_sale = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const result = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: whereCondition,
          required: true
        },
        {
          model: Product,
          required: true,
          attributes: []
        }
      ],
      attributes: [
        [sequelize.col('Product.category'), 'category'],
        [sequelize.literal('SUM(quantity_sold * Product.unit_price * (1 - OrderItem.discount))'), 'revenue']
      ],
      group: ['Product.category'],
      raw: true
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenueByRegion = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereCondition = {};
    if (startDate && endDate) {
      whereCondition.date_of_sale = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const result = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: whereCondition,
          required: true
        },
        {
          model: Product,
          required: true,
          attributes: []
        }
      ],
      attributes: [
        'region',
        [sequelize.literal('SUM(quantity_sold * Product.unit_price * (1 - OrderItem.discount))'), 'revenue']
      ],
      group: ['region'],
      raw: true
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const { Op } = require('sequelize');
const { OrderItem, Order, Product } = require('../models');

exports.getTotalRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereCondition = {};
    if (startDate && endDate) {
      whereCondition.date_of_sale = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const result = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: whereCondition,
          required: true
        },
        {
          model: Product,
          required: true
        }
      ],
      attributes: [
        [sequelize.literal('SUM(quantity_sold * Product.unit_price * (1 - OrderItem.discount))'), 'total_revenue']
      ],
      raw: true
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};