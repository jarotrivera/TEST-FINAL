const express = require('express');
const { actualizarEstadoEstacionamiento, obtenerEstadoEstacionamiento } = require('../controllers/parkingController');
const router = express.Router();

router.post('/update', actualizarEstadoEstacionamiento);
router.get('/', obtenerEstadoEstacionamiento);

module.exports = router;
