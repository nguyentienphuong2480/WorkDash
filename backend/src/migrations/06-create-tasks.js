"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tasks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "projects",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: Sequelize.TEXT,
      status: {
        type: Sequelize.STRING(50),
        defaultValue: "pending"
      },
      priority: Sequelize.STRING(20),
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
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
    await queryInterface.dropTable("tasks");
  }
};
