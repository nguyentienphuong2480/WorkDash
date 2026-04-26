"use strict";

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "pending",
      },
      priority: {
        type: DataTypes.STRING(20),
      },
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
    },
    {
      tableName: "tasks",
      timestamps: true,
      underscored: true,
    },
  );
  Task.associate = (models) => {
    Task.belongsTo(models.Project, {
      foreignKey: "project_id",
    });
    Task.belongsToMany(models.User, {
      through: models.TaskAssignment,
      foreignKey: "task_id",
    });
    Task.hasMany(models.TaskAssignment,{
      foreignKey: "task_id",
      as: "assignments"
    })
  };
  return Task;
};
