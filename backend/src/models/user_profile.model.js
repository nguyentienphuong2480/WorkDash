"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      full_name: {
        type: DataTypes.STRING(100)
      },

      phone: {
        type: DataTypes.STRING(20)
      },

      birthday: {
        type: DataTypes.DATEONLY
      },

      gender: {
        type: DataTypes.ENUM("male", "female", "other")
      },

      address: {
        type: DataTypes.STRING(255)
      },

      avatar: {
        type: DataTypes.STRING
      },

      position: {
        type: DataTypes.STRING(100)
      },

      department: {
        type: DataTypes.STRING(100)
      }
    },
    {
      tableName: "user_profiles",
      timestamps: true,
      underscored: true,

      /* ✅ BẮT BUỘC */
      paranoid: true,
      deletedAt: "deleted_at"
    }
  );

  /* ================= ASSOCIATION ================= */
  UserProfile.associate = models => {
    UserProfile.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
  };

  return UserProfile;
};
