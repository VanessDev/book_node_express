//middleware pour verifier si l'utilisateur est admin
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Utilisateur non authentifié",
      data: null
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Seuls les admins ont acces",
      data: null
    });
  }

  next();
};
