// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Route d'inscription
// -> POST http://localhost:3000/monapi/auth/register
router.post("/register", authController.register);

// Route de connexion
// -> POST http://localhost:3000/monapi/auth/login
router.post("/login", authController.login);

module.exports = router;
