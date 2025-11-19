// src/middlewares/auth.validators.js
const { body } = require("express-validator");

// validation d'enregistrement
const registerRules = [
  body("email")
    .isEmail()
    .withMessage("email pas correct"),

  body("password")
    .isLength({ min: 8 }) // ⚠️ isLength (L majuscule)
    .withMessage("mini 8 caractères"),

  body("name")
    .isLength({ min: 3 })
    .withMessage("mini 3 caractères"),
];

// validation de connexion
const loginRules = [
  body("email")
    .isEmail()
    .withMessage("email pas correct"),
  body("password")
    .notEmpty()
    .withMessage("mot de passe obligatoire"),
];

module.exports = {
  registerRules,
  loginRules,
};
