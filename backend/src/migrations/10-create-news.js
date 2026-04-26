"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("news", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      content: Sequelize.TEXT,
      status: Sequelize.STRING(50),
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("news");
  }
};
