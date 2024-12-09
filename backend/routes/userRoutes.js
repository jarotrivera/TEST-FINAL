const express = require('express');
const { registerUser, getPosts, deleteUser, cambiarRol, obtenerUsuarios } = require('../controllers/userController');
const { login } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar un nuevo usuario (solo accesible para administradores)
router.post('/register', authenticateUser, (req, res, next) => {
  // Verificar si el usuario autenticado es administrador
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden registrar usuarios.' });
  }
  next(); // Permitir acceso si el rol es admin
}, registerUser);

// Otras rutas
router.post('/login', login);
router.get('/posts', getPosts);
router.delete('/users/:id', authenticateUser, deleteUser);
router.get('/', authenticateUser, obtenerUsuarios);
router.put('/:id/role', authenticateUser, cambiarRol);

module.exports = router;
