'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          'planning',
          'active',
          'completed',
          'archived'
        ),
        allowNull: false,
        defaultValue: 'planning',
      },

      start_date: {
        type: DataTypes.DATEONLY,
      },

      end_date: {
        type: DataTypes.DATEONLY,
      },

      manager_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'projects',
      underscored: true,
      timestamps: true,
      paranoid: true,
      deletedAt: 'deleted_at',
    }
  );

  // ================== Associations ==================
  Project.associate = (models) => {
    // Manager
    Project.belongsTo(models.User, {
      foreignKey: 'manager_id',
      as: 'manager',
    });

    // Members
    Project.belongsToMany(models.User, {
      through: models.ProjectMember,
      foreignKey: "project_id",
      as: 'members'
    });

    Project.hasMany(models.Task, {
      foreignKey: 'project_id',
    });
  };

  return Project;
};
