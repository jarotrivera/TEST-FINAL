const express = require('express');
const { obtenerHistorial, registrarAccion } = require('../controllers/historialController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener el historial
router.get('/', authenticateUser, obtenerHistorial,registrarAccion);

module.exports = router;
