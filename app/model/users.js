'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
        users.hasOne(models.email_tables, {
          foreignKey: "userId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });
        users.hasOne(models.phone_tables, {
          foreignKey: "userId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });
    }
  }
  users.init(
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      randomNumber:DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};