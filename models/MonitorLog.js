const db = require('../config/db');

class MonitorLog {
    static async create({ monitor_id, status_code, response_time }) {
        const query = `INSERT INTO monitor_logs (monitor_id, status_code, response_time) VALUES ($1, $2, $3) RETURNING *`;
        const values = [monitor_id, status_code, response_time];
        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0];
        } catch (error) {
            throw new Error("Error creating monitor log: " + error.message);
        }
    }

    static async findByMonitorId(monitor_id) {
        const query = `SELECT * FROM monitor_logs WHERE monitor_id = $1 ORDER BY checked_at DESC`;
        try {
            const { rows } = await db.executeQuery(query, [monitor_id]);
            return rows;
        } catch (error) {
            throw new Error("Error fetching monitor logs: " + error.message);
        }
    }
}
module.exports = MonitorLog;