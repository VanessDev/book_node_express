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

app.get("/test-form-upload", (req, res) => {
  res.send(`
    <h1>Test upload</h1>
    <form action="/monapi/books/test-upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="image" />
      <button type="submit">Uploader</button>
    </form>
  `);
});
