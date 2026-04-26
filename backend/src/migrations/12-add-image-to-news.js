"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("news", "image_url", {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("news", "image_url");
  }
};

