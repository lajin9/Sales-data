const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/refresh', dataController.refreshData);
router.get('/refresh/status', dataController.getRefreshStatus);

module.exports = router;