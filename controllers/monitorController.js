const Monitor = require('../models/monitorModel');
const uptimeChecker = require('../utils/uptimeChecker');
const db = require("../config/db");

// Create a new monitor
exports.createMonitor = async (req, res) => {
    try {
        const { name, url, type, interval } = req.body;
        const user_id = 1;
        const newMonitor = await Monitor.create({ user_id, name, url, type, interval });
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

// Get all monitors for scheduler
exports.getAllMonitorsScheduler = async () => {
    try {
        const monitors = await Monitor.findAllScheduler();
        return monitors;
    } catch (error) {
        console.log(error);
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

        const url_with_protocol = `${monitor.type.toLowerCase()}://${monitor.url}`;
        // console.log("url", url_with_protocol);
        const status = await uptimeChecker(url_with_protocol);
        res.status(200).json({ url: monitor.url, status });
    } catch (error) {
        res.status(500).json({ message: "Error checking monitor", error: error.message });
    }
};

exports.updateMonitorStatus = async (id, status) => {
    try {
        const updatedMonitor = await Monitor.updateStatus(id, status);
        if (!updatedMonitor) {
            return { message: "Monitor not found" };
        }
        return updatedMonitor;
    } catch (error) {
        console.log(error);
    }
};

// show uptime history in the UI
exports.getUptimeLogs = async (req, res) => {
    const { monitorId } = req.params;

    try {
        const query = `SELECT * FROM uptime_logs WHERE monitor_id = $1 ORDER BY checked_at DESC LIMIT 50;`;
        const { rows } = await db.executeQuery(query, [monitorId]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
};