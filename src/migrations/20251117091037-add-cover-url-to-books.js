"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("books", "cover_url", {
      type: Sequelize.STRING,   // STRING = VARCHAR en MySQL
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("books", "cover_url");
  },
};
