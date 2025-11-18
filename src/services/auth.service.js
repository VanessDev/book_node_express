const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// renforce le hashage du password
const SALT_ROUNDS = 10;

// S'ENREGISTRER


async function register({ name, email, password }) {
  // utilise bcrypt pour hasher le mot de passe
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  // créer l'utilisateur et stocker le mot de passe hashé
  return User.create({ name, email, password: hash });
}


// VALIDATION DES DONNÉES DE CONNEXION (CRÉDENTIALS)


async function validateCredentials(email, password) {
  // vérifier en BDD le user
  const user = await User.findOne({ where: { email } });

  // si pas de compte, on stoppe l'exécution
  if (!user) return null;

  // comparer les mots de passe (hash vs password fourni)
  const isValid = await bcrypt.compare(password, user.password);

  // si la comparaison est ok on renvoie l'utilisateur
  // sinon on renvoie null
  return isValid ? user : null;
}

// GÉNÉRATION DU TOKEN JWT


function generateToken(user) {
  return jwt.sign(
    { sub: user.id }, // tu peux limiter au strict minimum
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
}


module.exports = {
  register,
  validateCredentials,
  generateToken,
};
