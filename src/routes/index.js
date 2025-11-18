// src/routes/index.js
const express = require("express");
const router = express.Router();

const booksRoutes = require("./books.routes");
const authRoutes = require("./auth.routes");

// /monapi/books/...
router.use("/books", booksRoutes);

// /monapi/auth/...
router.use("/auth", authRoutes);

module.exports = router;
