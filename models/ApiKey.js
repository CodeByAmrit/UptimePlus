const db = require('../config/db');
class ApiKey {
    static async create({ user_id, key }) {
        const query = `INSERT INTO api_keys (user_id, key) VALUES ($1, $2) RETURNING *`;
        const values = [user_id, key];
        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0];
        } catch (error) {
            throw new Error("Error creating API key: " + error.message);
        }
    }
}
module.exports = ApiKey;