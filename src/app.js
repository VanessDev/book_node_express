//import du packet express et des autres
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require("./routes");
const notFound = require('./middlewares/notFound');

//crée l'application express
const app = express();

//autoriser les request cross origin
app.use(cors());
// parse le contenu du body de ma request (req.body)
app.use(express.json());
//log les request http
app.use(morgan('dev'));

//chercher toutes mes routes (sous la route /monApi)
app.use('/monapi', router);

//je recupere la requet qui n'a pas trouvé de route
app.use(notFound);

//export app
module.exports = app;