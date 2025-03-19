const express = require('express');
const checkAuth = require("../services/checkauth");
const Monitor = require("../models/monitorModel")
const router = express.Router();


router.get("/login", (req, res) => {
    res.render("login");
})

router.use(checkAuth)

router.get("/dashboard", async (req, res) => {
    try {
        const monitors = await Monitor.findAll(req.user._id);
        res.render("dashboard", { user: req.user, monitors: monitors || null });
    } catch (error) {
        res.status(500).json({ message: "Error fetching monitors", error: error.message });
    }
})

module.exports = router;