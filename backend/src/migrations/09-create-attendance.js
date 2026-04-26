"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      check_in: Sequelize.DATE,
      check_out: Sequelize.DATE,
      working_hours: Sequelize.FLOAT,
      status: Sequelize.STRING(50),
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("attendance");
  },
};
