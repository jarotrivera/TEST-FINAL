const express = require('express');
const { createGastosTable, addCellToTable, getGastosTables, deleteGastosTable } = require('../controllers/gastosController');
const router = express.Router();

// Ruta para crear una nueva tabla de gastos
router.post('/crear', createGastosTable);

// Ruta para agregar una celda a una tabla de gastos
router.post('/:tablaId/cell', addCellToTable);

// Ruta para obtener todas las tablas de gastos
router.get('/', getGastosTables);

// Ruta para eliminar una tabla de gastos por ID
router.delete('/:id', deleteGastosTable);

module.exports = router;
