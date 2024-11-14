// models/GastosTable.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const GastosTableCells = require('./GastosTableCells');

class GastosTable extends Model {}

GastosTable.init(
  {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    columnas: {
      type: DataTypes.TEXT, // Nueva columna para almacenar nombres de columnas personalizados
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('columnas');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('columnas', JSON.stringify(value));
      },
    },
  },
  {
    sequelize,
    modelName: 'GastosTable',
  }
);

// Asociación: GastosTable tiene muchas celdas
GastosTable.hasMany(GastosTableCells, { foreignKey: 'tablaId', as: 'celdas' });
GastosTableCells.belongsTo(GastosTable, { foreignKey: 'tablaId', as: 'tabla' });

module.exports = GastosTable;
