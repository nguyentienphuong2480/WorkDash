"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProjectMember = sequelize.define(
    "ProjectMember",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      role_in_project: {
        type: DataTypes.STRING(50)
      }
    },
    {
      tableName: "project_members",
      timestamps: true,
      underscored: true
    }
  );
  return ProjectMember;
};
