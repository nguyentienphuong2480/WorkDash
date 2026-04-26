'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
      }
    },
    {
      tableName: "roles",
      timestamps: false
    }
  );
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "role_id" });
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: "role_id",
      as: "permissions"
    });
  }
  return Role;
};
