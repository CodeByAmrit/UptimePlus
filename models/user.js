const db = require('../config/db');
const { setUser, logoutUser, getUser } = require("../services/aouth");
const bcrypt = require('bcrypt');
require('dotenv').config()

class User {
    // Create a new user
    static async create({ name, email, password }) {
        // console.log(name, email, password ); return;
        const salt = parseInt(process.env.saltRounds);;
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const values = [name, email, hashedPassword];

        try {
            const { rows } = await db.executeQuery(query, values);
            delete rows[0].password;
            return rows[0];
        } catch (error) {
            throw new Error("Error creating monitor: " + error.message);
        }
    }
    // Get all user
    static async findAll() {
        const query = `SELECT * FROM users`;

        try {
            const { rows } = await db.executeQuery(query);
            return rows;
        } catch (error) {
            throw new Error("Error fetching users: " + error.message);
        }
    }

    // Get a single user by ID
    static async findById(id) {
        const query = `SELECT * FROM users WHERE id = $1`;

        try {
            const { rows } = await db.executeQuery(query, [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error fetching user: " + error.message);
        }
    }
    // Get a single user by email
    static async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;

        try {
            const { rows } = await db.executeQuery(query, [email]);
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error fetching user: " + error.message);
        }
    }

    // Update a user
    static async update(id, { name, email }) {
        const query = `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`;
        const values = [name, email, id];

        try {
            const { rows } = await db.executeQuery(query, values);
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error updating user: " + error.message);
        }
    }

    // Update a user password
    static async updatePassword(id, password) {
        const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`;
        const values = [password, id];

        try {
            const { rows } = await db.executeQuery(query, password);
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error updating user: " + error.message);
        }
    }

    // Delete a user
    static async delete(id) {
        const query = `DELETE FROM users WHERE id = $1 RETURNING *`;

        try {
            const { rows } = await db.executeQuery(query, [id]);
            return rows[0] ? true : false;
        } catch (error) {
            throw new Error("Error deleting user: " + error.message);
        }
    }

    // Login User
    static async login(req, res) {

        let { email, password } = req.body;
        email = email?.trim().toLowerCase(); // Normalize email


        // Fetch user with LIMIT 1 for performance boost
        const rows = await this.findByEmail(email);

        if (rows === null) {
            // Delay response slightly to prevent email enumeration attacks
            await new Promise((resolve) => setTimeout(resolve, 500));
            return res.status(401).json({ status: 'Invalid email' });
        }

        const user = rows;

        // Secure password comparison
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(403).json({ status: 'Invalid Password' });
        }

        // JWT Payload
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        // Generate JWT token
        const token = setUser(payload);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 3600000,
        });
        res.json({ status: 'success', token });


    } catch(error) {
        throw new Error("Error Login User: " + error.message);
    }
    // logout User
    static async logout(req, res) {

        res.clearCookie("token").redirect("/login");

    } catch(error) {
        throw new Error("Error Login User: " + error.message);
    }

}

module.exports = User;