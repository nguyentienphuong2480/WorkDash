module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "Permission",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, unique: true },
      description: DataTypes.STRING,
    },
    {
      tableName: "permissions",
      underscored: true,
    }
  );

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: "permission_id",
      as: "roles",
    });
  };

  return Permission;
};