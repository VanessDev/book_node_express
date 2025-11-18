// src/controllers/auth.controller.js
const authService = require("../services/auth.service");

// inscription
async function register(req, res) {
  // ⚠ ICI : body, pas bosy
  const { name, email, password } = req.body;

  try {
    const user = await authService.register({ name, email, password });
    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
}

// connexion
async function login(req, res) {
  // ⚠ ICI AUSSI : body
  const { email, password } = req.body;

  try {
    const user = await authService.validateCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    const token = authService.generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
}

module.exports = { register, login };
