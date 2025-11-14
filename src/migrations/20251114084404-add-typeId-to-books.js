'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('books', 'type_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Types',   
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('books', 'type_id');
  }
};
