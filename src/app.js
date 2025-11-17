const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require("./routes");
const notFound = require('./middlewares/notFound');
const path = require("path");

const app = express();

// fichiers statiques /uploads/rendre accessible mon dossier upload par la request
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// toutes les routes de l'API sous /monapi
app.use('/monapi', router);

// 404
app.use(notFound);

module.exports = app;
