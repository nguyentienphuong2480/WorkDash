'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          'planning',
          'active',
          'completed',
          'archived'
        ),
        allowNull: false,
        defaultValue: 'planning',
      },

      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      manager_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('projects');
  },
};
