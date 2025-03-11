const crypto = require('crypto');
const db = require('../config/db');

class ApiKey {
    static async create({ user_id }) {
        // Generate a secure API key
        const apiKey = crypto.randomBytes(32).toString('hex');

        const query = `INSERT INTO api_keys (user_id, key) VALUES ($1, $2) RETURNING *`;
        const values = [user_id, apiKey];

        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0];
        } catch (error) {
            throw new Error("Error creating API key: " + error.message);
        }
    }
}

module.exports = ApiKey;
