const express = require('express');
const { actualizarEstadoEstacionamiento, obtenerEstadoEstacionamiento } = require('../controllers/parkingController');
const router = express.Router();

// Ruta para actualizar el estado del estacionamiento (sin autenticación temporalmente)
router.post('/update', actualizarEstadoEstacionamiento);

// Ruta para obtener el estado del estacionamiento (ya funcional)
router.get('/', obtenerEstadoEstacionamiento);

module.exports = router;
