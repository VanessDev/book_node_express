const db = require("../models");
const Book = db.Books;
const Type = db.Type;

const {
  validateCreateBook,
  validateUpdateBook,
} = require("../utils/bookValidation");

// Fonction qui vérifie et convertit un id provenant des paramètres d'URL
function parseId(params) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

// =====================
// Liste de tous les livres
// =====================
exports.listBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [["title", "ASC"]],
      include: [
        {
          model: Type,
          as: "type",
          attributes: ["id", "name"], // suppose que ton modèle Type a bien "name"
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "liste des livres",
      data: books,
    });
  } catch (error) {
    console.log("erreur pour get books", error);
    return res.status(500).json({
      success: false,
      message: "error sur get books",
      data: null,
    });
  }
};

// =====================
// Affichage d'un livre par ID
// =====================
exports.getBookById = async (req, res) => {
  try {
    const id = parseId(req.params);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id invalide",
        data: null,
      });
    }

    const book = await Book.findByPk(id, {
      include: [
        {
          model: Type,
          as: "type",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "livre non trouvé",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "livre trouvé",
      data: book,
    });
  } catch (error) {
    console.log("error sur find id book", error);
    return res.status(500).json({
      success: false,
      message: "error sur get by book",
      data: null,
    });
  }
};

// =====================
// Ajout d'un livre
// =====================
exports.createBook = async (req, res) => {
  try {
    const { title, author, typeId } = req.body;

    // validation joi éventuelle
    if (validateCreateBook) {
      const { error } = validateCreateBook(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
          data: null,
        });
      }
    }

    // validation simple
    if (!title || !author || !typeId) {
      return res.status(400).json({
        success: false,
        message: "les champs 'title', 'author' et 'typeId' sont obligatoires",
        data: null,
      });
    }

    // vérifier que le type existe
    const type = await Type.findByPk(typeId);
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "type inexistant",
        data: null,
      });
    }

    // création du book en DB
    const newBook = await Book.create({
      title,
      author,
      type_id: typeId, // on mappe bien typeId (body) -> type_id (DB)
    });

    return res.status(201).json({
      success: true,
      message: "book créé",
      data: newBook,
    });
  } catch (error) {
    console.log("error sur creation de book", error);
    return res.status(500).json({
      success: false,
      message: "error sur la creation book",
      data: null,
    });
  }
};

// =====================
// Update d'un livre
// =====================
exports.updateBook = async (req, res) => {
  try {
    const id = parseId(req.params);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id invalide",
        data: null,
      });
    }

    const { title, dispo, typeId } = req.body;

    if (validateUpdateBook) {
      const { error } = validateUpdateBook(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
          data: null,
        });
      }
    }

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "book pas là",
        data: null,
      });
    }

    // si on change le type, on vérifie qu’il existe
    if (typeId !== undefined) {
      const type = await Type.findByPk(typeId);
      if (!type) {
        return res.status(400).json({
          success: false,
          message: "type inexistant",
          data: null,
        });
      }
      book.type_id = typeId; // on met bien à jour la FK
    }

    // appliquer les modifications
    if (title !== undefined) book.title = title;
    if (dispo !== undefined) book.dispo = dispo;

    await book.save();

    return res.status(200).json({
      success: true,
      message: "livre mis à jour",
      data: book,
    });
  } catch (error) {
    console.log("error sur le update de book", error);
    return res.status(500).json({
      success: false,
      message: "error sur update book",
      data: null,
    });
  }
};

// =====================
// Suppression d'un livre
// =====================
exports.deleteBook = async (req, res) => {
  try {
    const id = parseId(req.params);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id invalide",
        data: null,
      });
    }

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book pas là",
        data: null,
      });
    }

    await book.destroy();

    return res.status(200).json({
      success: true,
      message: "book supprimé",
      data: null,
    });
  } catch (error) {
    console.log("error sur la suppression de book", error);
    return res.status(500).json({
      success: false,
      message: "error sur delete book",
      data: null,
    });
  }
};

// =====================
// Upload de l'image de couverture d'un livre
// =====================
exports.uploadCover = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "book pas là",
        data: null,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucune image envoyée",
        data: null,
      });
    }

    // je construis le chemin de l'image qui vient d'être uploadé
    //req.file.filename : contient le nom du fichier généré par Multer.
    const imagePath = `/uploads/${req.file.filename}`;

    // J’enregistre ce chemin dans l’objet book récupéré depuis la base.
    book.cover_url = imagePath;
    // Je sauvegarde les modifications en base de données.
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Image uploadée et enregistrée",
      data: {
        id: book.id,
        cover_url: imagePath,
        file: req.file,
      },
    });
  } catch (error) {
    console.log("error sur upload cover", error);
    return res.status(500).json({
      success: false,
      message: "error sur upload cover",
      data: null,
    });
  }
};



// =====================
// Test de la connexion + modèle
// =====================
exports.test = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    const books = await Book.findAll({ limit: 1 });

    return res.status(200).json({
      success: true,
      message: "test de ma table books",
      data: books,
    });
  } catch (error) {
    console.error("erreur dans le test de books", error);
    return res.status(500).json({
      success: false,
      message: "echec lors du test de books",
      error: error.message,
    });
  }
};
