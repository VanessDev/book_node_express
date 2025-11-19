// src/routes/index.js
const express = require("express");
const router = express.Router();

const booksRoutes = require("./books.routes");
const authRoutes = require("./auth.routes");

const authMiddleware = require("../middlewares/auth.middleware");

// ROUTES PUBLIQUES

router.use("/auth", authRoutes);   // register / login


// ROUTES PROTÉGÉES

router.use("/books", authMiddleware, booksRoutes);

module.exports = router;
