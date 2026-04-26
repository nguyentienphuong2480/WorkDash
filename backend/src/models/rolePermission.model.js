module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "role_permissions",
      timestamps: false,
      underscored: true,
    },
  );
  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Role, {
      foreignKey: "role_id",
    });

    RolePermission.belongsTo(models.Permission, {
      foreignKey: "permission_id",
    });
  };

  return RolePermission;
};
