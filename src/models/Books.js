"use strict";

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    static associate(models) {
      //definir des relations
    }
  }

  Books.init({

      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
        }
    },
        author: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      dispo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },{
      //configuration
      sequelize,
      modelName: "Books", //le nom du model en javascript
      tableName: "books", //le nom de la table en db
      underscored: true, // snake case => kamelcase
      timestamps: true, // gestion du created at et updated automatiquement
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Books;
};