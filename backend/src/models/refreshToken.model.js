"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: "refresh_tokens",
      underscored: true,
      timestamps: true
    }
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE"
    });

    
  };

  return RefreshToken;
};
