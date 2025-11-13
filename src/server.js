require("dotenv").config();

const app = require('./app');
const PORT = process.env.PORT;


if (!PORT) {
  console.log("PORT absent, veuillez compléter le fichier .env");
  process.exit(1);
}


app.listen(PORT, () =>
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
);
