const express = require('express');
const checkAuth = require("../services/checkauth");
const router = express.Router();


router.get("/login", (req, res) => {
    res.render("login");
})

router.use(checkAuth)
router.get("/dashboard", (req, res) => {
    res.render("dashboard",{user: req.user});
})

module.exports = router;