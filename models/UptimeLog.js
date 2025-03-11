const db = require('../config/db');
class UptimeLog {
    static async create({ monitor_id, status, response_time }) {
        const query = `INSERT INTO uptime_logs (monitor_id, status, response_time) VALUES ($1, $2, $3) RETURNING *`;
        const values = [monitor_id, status, response_time];
        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0];
        } catch (error) {
            throw new Error("Error creating uptime log: " + error.message);
        }
    }
}
module.exports = UptimeLog;