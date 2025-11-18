// src/app.js (ou src/server.js selon ton projet)
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require("./routes");
const notFound = require('./middlewares/notFound');
const path = require("path");

const app = express();

// rendre le dossier uploads accessible
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// toutes les routes de l'API sous /monapi
// -> /monapi/books/...
// -> /monapi/auth/...
app.use('/monapi', router);

// 404
app.use(notFound);

module.exports = app;
