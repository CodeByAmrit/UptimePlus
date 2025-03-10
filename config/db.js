const fs = require('fs');
const pg = require('pg');
const url = require('url');
require('dotenv').config()

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.DB_CA, "base64").toString("utf-8"),
    }
};


async function getConnection() {
    const client = new pg.Client(config);
    await client.connect();
    return client;
}

async function executeQuery(query, params = []) {
    const client = await getConnection();
    try {
        const result = await client.query(query, params);
        return result;
    } catch (err) {
        console.error("Query Execution Error:", err);
        throw err;
    } finally {
        await client.end();
    }
}

module.exports = { getConnection, executeQuery };