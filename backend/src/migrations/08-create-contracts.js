"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contracts", {
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
      contract_type: Sequelize.STRING(50),
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      salary: Sequelize.DECIMAL(12, 2),
      status: Sequelize.STRING(50),
      file_url: Sequelize.STRING,
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
    await queryInterface.dropTable("contracts");
  },
};
