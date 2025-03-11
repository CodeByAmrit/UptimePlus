const ApiKey = require("../models/ApiKey");

async function checkApi(req, res, next) {
    const api_key = req.headers.authorization?.split("Bearer ")[1];
    if (!api_key) {
        return res.status(400).json({ error: "API key is required" });
    }

    try {
        const isValid = await ApiKey.verifyKey(api_key);
        if (isValid) {
            return next();
        } else {
            return res.status(403).json({ error: "Invalid API key" });
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = checkApi;
