"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_profiles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      full_name: {
        type: Sequelize.STRING(100)
      },

      phone: {
        type: Sequelize.STRING(20)
      },

      birthday: {
        type: Sequelize.DATEONLY
      },

      gender: {
        type: Sequelize.ENUM("male", "female", "other")
      },

      address: {
        type: Sequelize.STRING(255)
      },

      avatar: {
        type: Sequelize.STRING
      },

      position: {
        type: Sequelize.STRING(100)
      },

      department: {
        type: Sequelize.STRING(100)
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_profiles");
  }
};
