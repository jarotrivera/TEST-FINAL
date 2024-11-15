const express = require('express');
const {
  createVenta,
  getVentas,
  getUserVentas,
  getUsersWithVentas, // Asegúrate de importar esta función si está en tu controlador
  editVenta,
  deleteVenta
} = require('../controllers/ventaController');
const { authenticateUser} = require('../middlewares/authMiddleware'); // Asegúrate de importar `isAdmin` si lo necesitas

const router = express.Router();

// Ruta para obtener todas las ventas (para usuarios)
router.get('/', authenticateUser, getVentas);

// Ruta para que el usuario obtenga sus propias ventas
router.get('/user', authenticateUser, getUserVentas);

// Ruta para que el administrador obtenga todas las ventas por usuario
router.get('/users-with-ventas', authenticateUser, getUsersWithVentas);

// Ruta para crear una nueva venta
router.post('/', authenticateUser, createVenta);

// Ruta para editar una venta existente
router.put('/:id', authenticateUser, editVenta);

// Ruta para eliminar una venta existente
router.delete('/:id', authenticateUser, deleteVenta);

module.exports = router;
