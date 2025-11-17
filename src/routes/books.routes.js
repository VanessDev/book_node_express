const { Router } = require("express");
const booksController = require("../controllers/books.controller");
const upload = require("../config/multer");

const router = Router();

// TEST UPLOAD SANS DB
router.post("/test-upload", upload.single("image"), (req, res) => {
  console.log("TEST req.headers['content-type'] =", req.headers["content-type"]);
  console.log("TEST req.file =", req.file);
  console.log("TEST req.body =", req.body);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Aucun fichier reçu",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Fichier bien reçu",
    file: req.file,
  });
});

// upload d’une image pour un livre
router.post("/:id/cover", upload.single("image"), booksController.uploadCover);

router.get("/", booksController.listBooks);
router.get("/:id", booksController.getBookById);
router.post("/", booksController.createBook);
router.put("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

module.exports = router;
