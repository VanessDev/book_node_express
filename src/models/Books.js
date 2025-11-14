"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    static associate(models) {
      this.belongsTo(models.Type, {
        foreignKey: "type_id",
        as: "type",
      });
    }
  }

  Books.init(
    {
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
        },
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
      }

    
    },

    {
      sequelize,
      modelName: "Books",
      tableName: "books",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Books;
};
