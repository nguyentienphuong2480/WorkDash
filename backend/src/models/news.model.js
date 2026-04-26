"use strict";

module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define(
    "News",
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
      content: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING(50),
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "news",
      timestamps: true,
      underscored: true,
    },
  );
  News.associate  = (models) => {
    News.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
  };
  return News;
};
