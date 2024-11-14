// models/ventaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const Venta = sequelize.define('Venta', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  foto: {
    type: DataTypes.TEXT('long'),
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});

Venta.belongsTo(User, { foreignKey: 'usuarioId', as: 'VentaUser' });

module.exports = Venta;
