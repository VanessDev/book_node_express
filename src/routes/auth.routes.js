// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const {
  registerRules,
  loginRules,
} = require("../middlewares/validation/auth.validators");

const validate = require("../middlewares/validate");

// -> POST http://localhost:3000/monapi/auth/register
router.post("/register", registerRules, validate, authController.register);

// -> POST http://localhost:3000/monapi/auth/login
router.post("/login", loginRules, validate, authController.login);



module.exports = router;
