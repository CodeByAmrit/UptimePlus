const cron = require("node-cron");
const checkUptime = require("./uptimeChecker");
const Monitor = require("../controllers/monitorController");
const fs = require("fs");
const path = require("path");

// Path to store failure logs
const logFilePath = path.join(__dirname, "../logs/failures.log");

// ✅ Ensure logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Set to track recent checks (prevents flooding the same domain)
const recentChecks = new Set();

// Global task reference (for restarting cron job)
let scheduledTask;

// Function to log failures
function logFailure(monitor, status) {
    const logEntry = `${new Date().toISOString()} | ${monitor.type}://${monitor.url} | Status: ${status}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error("Error writing to failure log:", err);
    });
}

// ✅ Function to start or restart the cron job
async function startCronJob() {
    if (scheduledTask) {
        scheduledTask.stop(); // Stop the previous job if it exists
        console.log("⏳ Restarting cron job...");
    }

    scheduledTask = cron.schedule("2 * * * * *", async () => {
        console.log("🔍 Running scheduled uptime check...");

        try {
            const monitors = await Monitor.getAllMonitorsScheduler();

            for (const monitor of monitors) {
                // ✅ Construct URL with protocol
                const url_with_protocol = `${monitor.type.toLowerCase()}://${monitor.url}`;

                if (recentChecks.has(url_with_protocol)) {
                    console.log(`⚠ Skipping ${url_with_protocol}, already checked recently.`);
                    continue;
                }
                console.log("added ", monitor.id);
                recentChecks.add(url_with_protocol);

                // Perform uptime check
                const { status } = await checkUptime(url_with_protocol);

                // Update database with the new status
                await Monitor.updateMonitorStatus(monitor.id, status);
                console.log(`✅ Checked ${url_with_protocol}: ${status}`);

                if (status !== "UP") {
                    logFailure(monitor, status);
                }
            }

            recentChecks.clear();
        } catch (err) {
            console.error("❌ Error in scheduled task:", err);
        }
    });

    console.log("✅ Cron job scheduled: Running every 5 minutes");
}

// Start the cron job initially
startCronJob();


// ✅ Export restart function so it can be triggered when a monitor is added/deleted
module.exports = { startCronJob };
