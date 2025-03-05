const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

// Create a new monitor
router.post('/monitors', monitorController.createMonitor);

// Get all monitors
router.get('/monitors', monitorController.getAllMonitors);

// Get a specific monitor by ID
router.get('/monitors/:id', monitorController.getMonitorById);

// Update a monitor
router.put('/monitors/:id', monitorController.updateMonitor);

// Delete a monitor
router.delete('/monitors/:id', monitorController.deleteMonitor);

// Manually trigger uptime check for a monitor
router.get('/monitors/:id/check', monitorController.checkMonitor);

module.exports = router;
