"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_members", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "projects",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      role_in_project: Sequelize.STRING(50),
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
    await queryInterface.dropTable("project_members");
  }
};
