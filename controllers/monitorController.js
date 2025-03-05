const Monitor = require('../models/monitorModel');
const uptimeChecker = require('../utils/uptimeChecker');

// Create a new monitor
exports.createMonitor = async (req, res) => {
    try {
        const { name, url, interval } = req.body;
        const newMonitor = await Monitor.create({ name, url, interval });
        res.status(201).json(newMonitor);
    } catch (error) {
        res.status(500).json({ message: "Error creating monitor", error: error.message });
    }
};

// Get all monitors
exports.getAllMonitors = async (req, res) => {
    try {
        const monitors = await Monitor.findAll();
        res.status(200).json(monitors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching monitors", error: error.message });
    }
};

// Get a single monitor by ID
exports.getMonitorById = async (req, res) => {
    try {
        const monitor = await Monitor.findById(req.params.id);
        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }
        res.status(200).json(monitor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching monitor", error: error.message });
    }
};

// Update a monitor
exports.updateMonitor = async (req, res) => {
    try {
        const updatedMonitor = await Monitor.update(req.params.id, req.body);
        if (!updatedMonitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }
        res.status(200).json(updatedMonitor);
    } catch (error) {
        res.status(500).json({ message: "Error updating monitor", error: error.message });
    }
};

// Delete a monitor
exports.deleteMonitor = async (req, res) => {
    try {
        const deleted = await Monitor.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Monitor not found" });
        }
        res.status(200).json({ message: "Monitor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting monitor", error: error.message });
    }
};

// Manually check a monitor's uptime
exports.checkMonitor = async (req, res) => {
    try {
        const monitor = await Monitor.findById(req.params.id);
        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }

        const status = await uptimeChecker(monitor.url);
        res.status(200).json({ url: monitor.url, status });
    } catch (error) {
        res.status(500).json({ message: "Error checking monitor", error: error.message });
    }
};
