const db = require("../models");
const Book = db.Books;
const Type = db.Type;

const {
  validateCreateBook,
  validateUpdateBook,
} = require("../utils/bookValidation");

// Fonction qui vérifie et convertit un id provenant des paramètres d'URL
function parseId(params) {
  // On récupère params.id (qui est une string) et on le convertit en nombre
  const id = Number(params.id);

  // Si l'id n'est pas un entier OU s'il est inférieur ou égal à 0,
  // alors ce n'est pas un identifiant valide
  if (!Number.isInteger(id) || id <= 0) {
    // On retourne null pour indiquer une valeur invalide
    return null;
  }

  // Si l'id est un entier positif, on le retourne
  return id;
}

// Liste de tous les livres
exports.listBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [["title", "ASC"]],
      // on inclut le type du livre dans la réponse
      include: [
        {
          model: Type,
          as: "type",
          // champs qu’on renvoie pour le type
          attributes: ["id", "Name"], 
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

// Affichage d'un livre par ID
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
          attributes: ["id", "Name"],
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

// Ajout d'un livre
exports.createBook = async (req, res) => {
  try {
    const { title, author, typeId } = req.body;

    // validation avec ton schéma (si tu l'as mis en place)
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

    // validation simple au cas où
    if (!title || !author || !typeId) {
      return res.status(400).json({
        success: false,
        message: "les champs 'title', 'author' et 'typeId' sont obligatoires",
        data: null,
      });
    }

    // optionnel : vérifier que le type existe
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
      typeId, // attention : on utilise bien 'typeId' côté JS
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

// Update d'un livre
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
      book.typeId = typeId;
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

// Suppression d'un livre
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

// Test de la connexion + modèle
exports.test = async (req, res) => {
  try {
    // vérifier la connexion
    await db.sequelize.authenticate();

    // vérifier que le modèle fonctionne
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
