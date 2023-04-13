'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Card.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Card.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    start: DataTypes.TIME,
    end: DataTypes.TIME,
    record: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Card',
    tableName: 'Cards'
  });
  return Card;
};