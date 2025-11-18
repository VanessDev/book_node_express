const jwt= require("jsonwebtoken");

function authMiddleware(req,res,next) {
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({message: "Token manquant ou invalide"});
    }

    const token = authHeader.split("")[1];

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET || "Supersecret");
        req.user = payload; //on stocke les infos du token dans req.user
        next();
    } catch(error) {
        return res.status(401).json({message:"Token invalid eou expiré"});
    }
}

module.exports= authMiddleware;

const authMiddleware = require("./middlewares/auth.middleware");

app.get("/api/profile", authMiddleware, (req,res) => {
    res.json({message:"Profil accessible",user:req.user});
});