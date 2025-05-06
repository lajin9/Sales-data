const loadData = require('../scripts/dataLoader');
const logger = require('../utils/logger');
const Queue = require('bull');
const dataRefreshQueue = new Queue('data-refresh');

exports.refreshData = async (req, res) => {
  try {
    const { csvPath, append } = req.body;
    
    // Add job to queue
    await dataRefreshQueue.add({ csvPath, append });
    
    res.json({
      status: 'success',
      message: 'Data refresh job queued'
    });
  } catch (error) {
    logger.error(`Data refresh error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to queue data refresh'
    });
  }
};

exports.getRefreshStatus = async (req, res) => {
  try {
    const jobs = await dataRefreshQueue.getJobs(['waiting', 'active', 'completed', 'failed']);
    res.json(jobs.map(job => ({
      id: job.id,
      status: job.status,
      progress: job.progress(),
      result: job.returnvalue,
      error: job.failedReason
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};