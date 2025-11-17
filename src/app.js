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

// route de test pour l’upload (via navigateur)
app.get("/test-form-upload", (req, res) => {
  res.send(`
    <h1>Test upload</h1>
    <form action="/monapi/books/test-upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="image" />
      <button type="submit">Uploader</button>
    </form>
  `);
});

// toutes les routes de l'API sous /monapi
app.use('/monapi', router);

// 404
app.use(notFound);

module.exports = app;
