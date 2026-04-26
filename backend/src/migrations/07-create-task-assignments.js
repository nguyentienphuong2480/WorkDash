"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("task_assignments", {
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
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tasks",
          key: "id"
        },
        onDelete: "CASCADE"
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
    await queryInterface.dropTable("task_assignments");
  }
};
