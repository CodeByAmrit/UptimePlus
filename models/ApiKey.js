const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../config/db');

class ApiKey {
    static async create(user_id) {        
        // Generate a secure API key
        const rawKey = crypto.randomBytes(32).toString('hex');
        const hashedKey = await bcrypt.hash(rawKey, 10); // Hash the key

        const query = `INSERT INTO api_keys (user_id, key) VALUES ($1, $2) RETURNING *`;
        const values = [user_id, hashedKey];

        try {
            await db.executeQuery(query, values);
            return { api_key: rawKey }; // Send only the raw key to the user
        } catch (error) {
            throw new Error("Error creating API key: " + error.message);
        }
    }

    static async delete(user_id, { id }) {
        // const query = `INSERT INTO api_keys (user_id, key) VALUES ($1, $2) RETURNING *`;
        const query = `DELETE FROM api_keys WHERE id = $1 and user_id = $2 RETURNING *`;

        try {
            const { rows } = await db.executeQuery(query, [id, user_id]);
            return rows[0] ? true : `API Not Found with id ${id}`;
        } catch (error) {
            throw new Error("Error creating API key: " + error.message);
        }
    }

    static async verifyKey(apiKey) {
        const query = `SELECT key FROM api_keys`; // Get all API keys (or filter by user if needed)

        try {
            const { rows } = await db.executeQuery(query);
            for (const row of rows) {
                if (await bcrypt.compare(apiKey, row.key)) {
                    return true; // API key matched a hashed key
                }
            }
            return false; // No match found
        } catch (error) {
            console.error("Error verifying API key:", error);
            return false;
        }
    }
}

module.exports = ApiKey;
