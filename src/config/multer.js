const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // racine/uploads   cb: call back
  },
  filename: (req, file, cb) => {
    //genere un nom unique pour les images
    const uniqueName = Date.now() + "-" + file.originalname;
    //genere le fichier
    cb(null, uniqueName);
    //on peut aussi le recuperer par son extension (comme .png) avec path.extname
  },
});

//le format/type du fichier

// le format/type du fichier
function fileFilter(res, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("format image uniquement!"), false);
  }
}


const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = upload;
