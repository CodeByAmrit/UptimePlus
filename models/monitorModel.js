const db = require('../config/db');

class Monitor {
    // Create a new monitor
    static async create({ name, url, interval }) {
        const query = `INSERT INTO monitors (name, url, interval) VALUES ($1, $2, $3) RETURNING *`;
        const values = [name, url, interval];

        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0];
        } catch (error) {
            throw new Error("Error creating monitor: " + error.message);
        }
    }

    // Get all monitors
    static async findAll() {
        const query = `SELECT * FROM monitors`;

        try {
            const { rows } = await db.executeQuery(query);
            return rows;
        } catch (error) {
            throw new Error("Error fetching monitors: " + error.message);
        }
    }

    // Get a single monitor by ID
    static async findById(id) {
        const query = `SELECT * FROM monitors WHERE id = $1`;

        try {
            const { rows } = await db.executeQuery(query, [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error fetching monitor: " + error.message);
        }
    }

    // Update a monitor
    static async update(id, { name, url, interval }) {
        const query = `UPDATE monitors SET name = $1, url = $2, interval = $3 WHERE id = $4 RETURNING *`;
        const values = [name, url, interval, id];

        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error updating monitor: " + error.message);
        }
    }

    // Delete a monitor
    static async delete(id) {
        const query = `DELETE FROM monitors WHERE id = $1 RETURNING *`;

        try {
            const { rows } = await db.executeQuery(query, [id]);
            return rows[0] ? true : false;
        } catch (error) {
            throw new Error("Error deleting monitor: " + error.message);
        }
    }
}

module.exports = Monitor;
