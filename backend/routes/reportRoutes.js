const express = require('express');
const { obtenerReportes, eliminarReporte, eliminarPublicacion, crearReporte } = require('../controllers/reportController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/reportes', authenticateUser, obtenerReportes);
router.delete('/reportes/:postId', authenticateUser, eliminarReporte);
router.delete('/posts/:id', authenticateUser, eliminarPublicacion);
router.post('/posts/:postId/report', authenticateUser, crearReporte);

module.exports = router;
