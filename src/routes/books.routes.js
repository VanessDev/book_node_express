// src/routes/books.routes.js
const { Router } = require("express");
const booksController = require("../controllers/books.controller");
const upload = require("../config/multer");
const requireRoleAdmin = require("../middlewares/requireRoleAdmin");

const router = Router();

// upload d’une image pour un livre
router.post("/:id/cover", upload.single("image"), booksController.uploadCover);

router.get("/", booksController.listBooks);
router.get("/:id", booksController.getBookById);
router.post("/", booksController.createBook);
router.put("/:id", booksController.updateBook);

// DELETE réservé aux admins
router.delete("/:id", requireRoleAdmin, booksController.deleteBook);

module.exports = router;
