"use strict";

module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      check_in: DataTypes.DATE,
      check_out: DataTypes.DATE,
      working_hours: DataTypes.FLOAT,
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: DataTypes.STRING(50),
    },
    {
      tableName: "attendance",
      timestamps: false,
      underscored: true,
    },
  );
  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, {
      foreignKey: "user_id"
    });
  };

  return Attendance;
};
