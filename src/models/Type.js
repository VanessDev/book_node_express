"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      // Un type peut avoir plusieurs livres
      // On vérifie que le modèle Book existe bien
      if (models.Book) {
        this.hasMany(models.Book, {
          foreignKey: "typeId", // nom de la propriété dans le modèle Book
          as: "books",
        });
      }
    }
  }

  Type.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Type",
      tableName: "types",
      timestamps: true,
    }
  );

  return Type;
};
