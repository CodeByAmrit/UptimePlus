const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
var cookieParser = require('cookie-parser')

const user_route = require("./routes/userRoutes");
const monitor_route = require("./routes/monitorRoutes");
const path = require("path");

const app = express();
const port = 3000;


// ✅ Attach the scheduler
// require("./utils/scheduler");

// ✅ Trust proxies (for rate limiting & IP tracking)
app.set("trust proxy", 1);

// Serve static files (for frontend testing)
app.use("/", express.static(path.join(__dirname, "public")));

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.disable('x-powered-by');

// ✅ CORS: Allow frontend to communicate with the API
app.use(
  cors({
    origin: ["http://127.0.0.1:5500"], // Allowed frontend URL
    methods: ["GET", "POST", "OPTIONS"], // Allow preflight requests
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors()); // Handle preflight requests

// ✅ Rate Limiting: Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
  message: "Too many requests, try again later.",
});
app.use(limiter);

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded",
  })
);

// Routes
app.use(user_route);
app.use(monitor_route);

// Default Route
app.get("/login", (req, res) => {
  res.redirect("/login.html");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start Server
module.exports = app;