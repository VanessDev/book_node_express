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

//authentification user 
app.post('/api/auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier la présence des champs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe requis." });
    }

    // 2. Récupérer l'utilisateur
    const [rows] = await pool.execute(
      "SELECT id, email, password FROM utilisateurs WHERE email = ?",
      [email]
    );

    const users = rows; 


    if (!users || users.length === 0) {
      return res
        .status(401)
        .json({ message: "Utilisateur inconnu." });
    }

    const user = users[0];

    // 3. Vérifier le mot de passe
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ message: "Mot de passe incorrect." });
    }

    // 4. Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretKey", // à changer en prod !
      { expiresIn: "24h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: 'Erreur serveur' });
  }
});


module.exports = app;
