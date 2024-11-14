// models/HistorialModeracion.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

class HistorialModeracion extends Model {}

HistorialModeracion.init({
  action: DataTypes.STRING,
  targetType: DataTypes.STRING,
  descripcion: DataTypes.STRING,
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'HistorialModeracion'
});

User.hasMany(HistorialModeracion, { foreignKey: 'userId' });
HistorialModeracion.belongsTo(User, { foreignKey: 'userId' });

module.exports = HistorialModeracion;
