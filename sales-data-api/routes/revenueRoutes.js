const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

// Total revenue
router.get('/total', revenueController.getTotalRevenue);

// Revenue by product
router.get('/by-product', revenueController.getRevenueByProduct);

// Revenue by category
router.get('/by-category', revenueController.getRevenueByCategory);

// Revenue by region
router.get('/by-region', revenueController.getRevenueByRegion);

module.exports = router;