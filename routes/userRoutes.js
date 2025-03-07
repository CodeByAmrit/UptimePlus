const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require("../services/checkauth");

router.post("/login", userController.login);

router.post("/signup", userController.createUser)

router.get("/user/:id", checkAuth, userController.getUserById);

router.get("/logout", checkAuth, userController.logout);


module.exports = router;