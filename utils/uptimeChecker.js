const axios = require('axios');

/**
 * Checks the status of a given URL.
 * @param {string} url - The URL to check.
 * @returns {Promise<{ status: string, responseTime: number }>}
 */
async function checkUptime(url) {
    const startTime = Date.now();

    try {
        const response = await axios.get(url, { timeout: 5000 }); // 5s timeout
        const responseTime = Date.now() - startTime;

        return {
            status: response.status === 200 ? 'UP' : 'DOWN',
            responseTime,
        };
    } catch (error) {
        return {
            status: 'DOWN',
            responseTime: null,
        };
    }
}

module.exports = checkUptime;
