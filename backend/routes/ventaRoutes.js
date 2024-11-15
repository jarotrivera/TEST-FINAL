// routes/ventaRoutes.js
const express = require('express');
const {
  createVenta,
  getVentas,
  editVenta,
  deleteVenta
} = require('../controllers/ventaController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateUser, getVentas); // Obtener todas las ventas
router.post('/', authenticateUser, createVenta); // Crear una nueva venta
router.put('/:id', authenticateUser, editVenta); // Editar una venta existente
router.delete('/:id', authenticateUser, deleteVenta); // Eliminar una venta

module.exports = router;
