require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { createBullBoard } = require('@bull-board/api');
const { ExpressAdapter } = require('@bull-board/express');
const winston = require('winston');
const { Sequelize } = require('sequelize');

// Initialize Express app
const app = express();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/application.log' })
  ]
});

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? msg => logger.info(msg) : false,
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import models
const Customer = require('./models/customer');
const Product = require('./models/product');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

// Model associations
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Bull queue for background jobs
const dataRefreshQueue = require('./jobs/dataRefresh');

// Bull Board UI for queue monitoring
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(dataRefreshQueue)],
  serverAdapter,
});
serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

// Import routes
const dataRoutes = require('./routes/dataRoutes');
const revenueRoutes = require('./routes/revenueRoutes');

// Register routes
app.use('/api/data', dataRoutes);
app.use('/api/revenue', revenueRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  logger.error('Stack trace:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection and server startup
const PORT = process.env.PORT || 3000;

async function initializeServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models with database (this will create tables if they don't exist)
    await sequelize.sync({ force: true }); // Use { force: true } for creating or recreating tables
    console.log('Database models synchronized successfully.');

    // Start your Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}


// Global process error handlers
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err.message);
  logger.error('Stack trace:', err.stack);
  process.exit(1); // Exit the process after logging the uncaught exception
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  logger.error('Reason:', reason);
  process.exit(1); // Exit the process after logging the unhandled rejection
});

initializeServer();

module.exports = app;
