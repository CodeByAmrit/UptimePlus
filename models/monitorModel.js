const db = require('../config/db');

class Monitor {
    // Create a new monitor
    static async create({ user_id, name, url, type, interval }) {
        // console.log("id", user_id); return;
        const query = `INSERT INTO monitors (user_id, name, url, type, interval) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [user_id, name, url, type, interval];

        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0];
        } catch (error) {
            throw new Error("Error creating monitor: " + error.message);
        }
    }

    // Get all monitors
    static async findAll(user_id = null) {
        let query;
        if (user_id != null) {
            query = `SELECT * FROM monitors where user_id = $1`;
            try {
                const { rows } = await db.executeQuery(query, [user_id]);
                return rows;
            } catch (error) {
                throw new Error("Error fetching monitors: " + error.message);
            }
        }
        else {
            query = `SELECT * FROM monitors`;
            try {
                const { rows } = await db.executeQuery(query);
                return rows;
            } catch (error) {
                throw new Error("Error fetching monitors: " + error.message);
            }
        }
    }

    // Get all monitors for Scheduler
    static async findAllScheduler() {
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

    // Update a monitor status
    static async updateStatus(id, status) {
        // Map uptime statuses to allowed database values
        const statusMap = {
            UP: "active",
            DOWN: "paused",
        };

        const dbStatus = statusMap[status] || "active"; // Default to 'active' if undefined

        const query = `UPDATE monitors SET status = $1 WHERE id = $2 RETURNING *`;
        const values = [dbStatus, id];

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
