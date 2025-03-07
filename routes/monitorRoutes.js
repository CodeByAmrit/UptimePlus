const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const checkAuth =  require("../services/checkauth");

// Create a new monitor
router.post('/monitors', checkAuth, monitorController.createMonitor);

// Get all monitors
router.get('/monitors', checkAuth, monitorController.getAllMonitors);

// Get a specific monitor by ID
router.get('/monitors/:id', checkAuth, monitorController.getMonitorById);

// Update a monitor
router.put('/monitors/:id', checkAuth, monitorController.updateMonitor);

// Delete a monitor
router.delete('/monitors/:id', checkAuth, monitorController.deleteMonitor);

// Manually trigger uptime check for a monitor
router.get('/monitors/:id/check', checkAuth, monitorController.checkMonitor);

router.get('/monitors/logs/:monitorId', checkAuth, monitorController.getUptimeLogs);

module.exports = router;
