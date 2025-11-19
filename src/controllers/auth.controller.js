// src/controllers/auth.controller.js
const authService = require("../services/auth.service");


// Inscription

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // petite validation basique
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Les champs 'name', 'email' et 'password' sont obligatoires",
        data: null,
      });
    }

    const user = await authService.register({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "Inscription réussie",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      data: null,
    });
  }
};


// Connexion

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation rapide
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Les champs 'email' et 'password' sont obligatoires",
        data: null,
      });
    }

    const user = await authService.validateCredentials(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
        data: null,
      });
    }

    const token = authService.generateToken(user);

  
    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      data: null,
    });
  }
};
