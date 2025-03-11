const db = require('../config/db');
class Alert {
    static async create({ monitor_id, user_id, type, status }) {
        const query = `INSERT INTO alerts (monitor_id, user_id, type, status) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [monitor_id, user_id, type, status];
        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0];
        } catch (error) {
            throw new Error("Error creating alert: " + error.message);
        }
    }
}
module.exports = Alert;