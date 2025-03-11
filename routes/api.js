const express = require('express');
const router = express.Router();
const MonitorLog = require('../models/MonitorLog');
const Alert = require('../models/Alert');
const UptimeLog = require('../models/UptimeLog');
const ApiKey = require('../models/ApiKey');
const checkApi = require("../services/checkAPI");
const checkAuth = require("../services/checkauth");

// Monitor Logs Routes
router.post('/logs', checkApi, async (req, res) => {
    try {
        const log = await MonitorLog.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/logs/:monitorId', checkApi, async (req, res) => {
    try {
        const logs = await MonitorLog.findByMonitorId(req.params.monitorId);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Alerts Routes
router.post('/alerts', checkApi, async (req, res) => {
    try {
        const alert = await Alert.create(req.body);
        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Uptime Logs Routes
router.post('/uptime', checkApi, async (req, res) => {
    try {
        const log = await UptimeLog.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Keys Routes
router.post('/api-keys', checkAuth, async (req, res) => {
    try {
        console.log(req.user._id);
        const apiKey = await ApiKey.create(req.user._id);
        res.status(201).json(apiKey);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Keys Routes 
router.delete('/api-keys', checkAuth, async (req, res) => {
    try {
        const apiKey = await ApiKey.delete(req.user._id, req.body);
        apiKey.message = "API deleted successfully";
        res.status(200).json(apiKey);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
