const cron = require("node-cron");
const Monitor = require("../controllers/monitorController");
const checkUptime = require("./uptimeChecker");
const fs = require("fs");
const path = require("path");

// ✅ Path to store failure logs
const logFilePath = path.join(__dirname, "../logs/failures.log");

// ✅ Ensure logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// 🔄 Set to track recent checks (prevents duplicate checks)
const recentChecks = new Set();

// 📌 Function to log failures
function logFailure(monitor, status, httpStatus) {
    const logEntry = `${new Date().toISOString()} | ${monitor.type}://${monitor.url} | Status: ${status} | HTTP ${httpStatus || "N/A"}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error("❌ Error writing to failure log:", err);
    });
}

// 🚀 Function to start/restart the cron job
async function startCronJob() {
    console.log("⏳ Restarting cron job...");

    cron.schedule("* * * * *", async () => {  // Runs every minute
        console.log("🔍 Running scheduled uptime check...");
        const currentMinute = new Date().getMinutes();

        try {
            const monitors = await Monitor.getAllMonitorsScheduler();

            for (const monitor of monitors) {
                // ✅ Skip if the interval does not match the current time
                if (monitor.interval <= 0 || currentMinute % monitor.interval !== 0) continue;

                const url_with_protocol = `${monitor.type.toLowerCase()}://${monitor.url}`;

                if (recentChecks.has(url_with_protocol)) {
                    console.log(`⚠ Skipping ${url_with_protocol}, already checked recently.`);
                    continue;
                }
                recentChecks.add(url_with_protocol);

                // ✅ Perform uptime check
                const { status, responseTime, httpStatus } = await checkUptime(url_with_protocol);

                // ✅ Update database with new status
                await Monitor.updateMonitorStatus(monitor.id, status, responseTime, httpStatus);

                console.log(`✅ Checked ${url_with_protocol}: ${status} (HTTP: ${httpStatus || "N/A"})`);

                if (status !== "UP") {
                    logFailure(monitor, status, httpStatus);
                }
            }

            recentChecks.clear();
        } catch (err) {
            console.error("❌ Error in scheduled task:", err);
        }
    });

    console.log("✅ Cron job scheduled: Running dynamically based on intervals");
}

// 🔄 Start cron job initially
startCronJob();

// ✅ Export restart function to restart when a monitor is added/deleted
module.exports = { startCronJob };
