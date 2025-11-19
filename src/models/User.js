'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associations si besoin plus tard
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // vérifie que c'est un email valide
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false, // stocke le hash du mdp
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'admin', // ou 'user' si tu préfères
      },
    },
    {
      sequelize,
      modelName: 'User',

    
      tableName: 'Users',

      // ⚠️ ON NE MET PLUS:
      // underscored
      // createdAt: 'created_at'
      // updatedAt: 'updated_at'
      // ==> du coup Sequelize utilise createdAt / updatedAt (camelCase)
      timestamps: true,
    }
  );

  return User;
};
