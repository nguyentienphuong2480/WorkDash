"use strict";
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      last_login_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,

      /* ✅ BẮT BUỘC */
      paranoid: true,
      deletedAt: "deleted_at",

      /* ================= SCOPE ================= */
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },

      scopes: {
        withPassword: {
          attributes: {},
        },
        deleted: {
          where: {
            deleted_at: {
              [Op.ne]: null,
            },
          },
        },
      },
    },
  );

  /* ================= ASSOCIATION ================= */
  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "Role",
    });

    User.hasOne(models.UserProfile, {
      foreignKey: "user_id",
      as: "profile",
    });

    User.hasMany(models.Project, {
      foreignKey: "manager_id",
      as: "managedProjects",
    });

    User.belongsToMany(models.Project, {
      through: models.ProjectMember,
      foreignKey: "user_id",
      as: "projects",
    });

    User.belongsToMany(models.Task, {
      through: models.TaskAssignment,
      foreignKey: "user_id",
    });

    User.hasMany(models.Contract, {
      foreignKey: "user_id",
    });

    User.hasMany(models.Attendance, {
      foreignKey: "user_id",
    });

    User.hasMany(models.News, {
      foreignKey: "created_by",
    });

    User.hasMany(models.RefreshToken, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    User.hasMany(models.TaskAssignment, {
      foreignKey: "user_id",
      as: "task_assignments"
    } )
  };
  return User;
};
