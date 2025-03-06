const axios = require("axios");

/**
 * Checks the status of a given URL.
 * @param {string} url - The URL to check.
 * @returns {Promise<{ status: string, responseTime: number | null, httpStatus: number | null, error?: string }>}
 */
async function checkUptime(url) {
    const startTime = Date.now();

    try {
        // 🔄 Use HEAD request (faster) unless URL explicitly requires GET
        const response = await axios.head(url, { timeout: 5000 });

        return {
            status: response.status >= 200 && response.status < 400 ? "UP" : "DOWN",
            responseTime: Date.now() - startTime,
            httpStatus: response.status,
        };
    } catch (error) {
        const responseTime = Date.now() - startTime;
        const httpStatus = error.response ? error.response.status : null;

        let status = "DOWN";
        let errorMessage = error.message;

        if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
            status = "TIMEOUT";
            errorMessage = "Request timeout (5s exceeded)";
        } else if (error.code === "ENOTFOUND") {
            errorMessage = "DNS resolution failed";
        } else if (error.code === "ECONNREFUSED") {
            errorMessage = "Connection refused";
        }

        return {
            status,
            responseTime: httpStatus ? responseTime : null,
            httpStatus,
            error: errorMessage,
        };
    }
}

// ✅ Example usage
// checkUptime("http://www.google.com").then(console.log);

module.exports = checkUptime;
