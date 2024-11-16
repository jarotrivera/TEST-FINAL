// models/GastosTableCells.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class GastosTableCells extends Model {}

GastosTableCells.init(
  {
    fila: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    columna: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
    },
    tablaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'GastosTableCells',
  }
);

module.exports = GastosTableCells;
