const cron = require("node-cron");
const checkUptime = require("./uptimeChecker");
const Monitor = require("../controllers/monitorController");
const fs = require("fs");
const path = require("path");

// Path to store failure logs
const logFilePath = path.join(__dirname, "../logs/failures.log");

// Set to track recent checks (prevents flooding the same domain)
const recentChecks = new Set();

// Function to log failures
function logFailure(monitor, status) {
    const logEntry = `${new Date().toISOString()} | ${monitor.url} | Status: ${status}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error("Error writing to failure log:", err);
    });
}

// Schedule job to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
    console.log("Running scheduled uptime check...");

    try {
        // Fetch all monitors from the database
        const monitors = await Monitor.getAllMonitors();

        // Iterate through each monitor
        for (const monitor of monitors) {
            // Security: Prevent multiple checks for the same URL in the same cycle
            if (recentChecks.has(monitor.url)) {
                console.log(`Skipping ${monitor.url}, already checked recently.`);
                continue;
            }
            recentChecks.add(monitor.url);

            // Perform uptime check
            const status = await checkUptime(monitor.url);

            // Update database with the new status
            await Monitor.updateMonitorStatus(monitor.id, status);
            console.log(`Checked ${monitor.url}: ${status}`);

            // If the check fails, log it separately
            if (status !== "UP") {
                logFailure(monitor, status);
            }
        }

        // Clear recent checks after execution
        recentChecks.clear();
    } catch (err) {
        console.error("Error in scheduled task:", err);
    }
});

console.log("Secure Cron job scheduled: Running every 5 minutes");
