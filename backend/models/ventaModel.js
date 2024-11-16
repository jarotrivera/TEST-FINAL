const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Venta = sequelize.define('Venta', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  foto: { type: DataTypes.TEXT('long') },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Venta;
