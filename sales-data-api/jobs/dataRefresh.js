const Queue = require('bull');
const loadData = require('../scripts/dataLoader');
const logger = require('../utils/logger');

const dataRefreshQueue = new Queue('data-refresh', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  }
});

dataRefreshQueue.process(async (job) => {
  try {
    const { csvPath, append } = job.data;
    logger.info(`Starting data refresh job for ${csvPath}`);
    await loadData(csvPath, append);
    return { status: 'completed' };
  } catch (error) {
    logger.error(`Data refresh job failed: ${error.message}`);
    throw error;
  }
});

module.exports = dataRefreshQueue;