'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class email_tables extends Model {
    static associate(models) {
        email_tables.belongsTo(models.users, {
          foreignKey: "userId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        });
    }
  }
  email_tables.init(
    {
      email: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "email_tables",
    }
  );
  return email_tables;
};