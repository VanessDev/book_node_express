"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      // Un type peut avoir plusieurs livres
      this.hasMany(models.Books, {
        foreignKey: "type_id", // colonne dans la table books
        as: "books",
      });
    }
  }

  Type.init(
    {
      // id sera créé automatiquement (id, autoIncrement, PK) 
      // si ta table le respecte côté MySQL

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Type",
      tableName: "types",           // 👈 on force bien le nom de la table SQL
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Type;
};
