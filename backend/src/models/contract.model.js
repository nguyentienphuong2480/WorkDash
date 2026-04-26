"use strict";

module.exports = (sequelize, DataTypes) => {
  const Contract = sequelize.define(
    "Contract",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      contract_type: {
        type: DataTypes.STRING(50),
      },
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      salary: {
        type: DataTypes.DECIMAL(12, 2),
      },
      status: {
        type: DataTypes.STRING(50),
      },
      file_url: DataTypes.STRING,
    },
    {
      tableName: "contracts",
      timestamps: false,
      underscored: true,
    },
  );
  Contract.associate = (models) => {
    Contract.belongsTo(models.User, {
      foreignKey: "user_id",
    });
  };
  return Contract;
};
