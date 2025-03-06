const axios = require("axios");

/**
 * Checks the status of a given URL.
 * @param {string} url - The URL to check.
 * @returns {Promise<{ status: string, responseTime: number | null, httpStatus: number | null }>}
 */
async function checkUptime(url) {
    const startTime = Date.now();

    try {
        const response = await axios.get(url, { timeout: 5000 }); // 5s timeout
        const responseTime = Date.now() - startTime;

        return {
            status: response.status >= 200 && response.status < 400 ? "UP" : "DOWN",
            responseTime,
            httpStatus: response.status,
        };
    } catch (error) {
        const isTimeout = error.code === "ECONNABORTED" || error.message.includes("timeout");

        return {
            status: isTimeout ? "TIMEOUT" : "DOWN",
            responseTime: null,
            httpStatus: error.response ? error.response.status : null, // Capture HTTP status if available
        };
    }
}

// checkUptime("http://www.google.com").then((checkUptime) => {
//     console.log(checkUptime);
// });

module.exports = checkUptime;
