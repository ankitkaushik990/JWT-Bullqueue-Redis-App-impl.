'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phone_tables extends Model {
    static associate(models) {
            phone_tables.belongsTo(models.users, {
              foreignKey: "userId",
              onDelete: "CASCADE",
              onUpdate: "CASCADE",
            });
    }
  }
  phone_tables.init(
    {
      phone: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "phone_tables",
    }
  );
  return phone_tables;
};