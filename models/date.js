'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Date extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Date.belongsTo(models.User, { foreignKey: 'userId' })
      Date.hasMany(models.Card, { foreignKey: 'dateId' })
    }
  }
  Date.init({
    userId: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    day: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Date',
    tableName: 'Dates'
  });
  return Date;
};