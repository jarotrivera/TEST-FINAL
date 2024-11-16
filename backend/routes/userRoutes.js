const express = require('express');
const { registerUser, getPosts, deleteUser, cambiarRol, obtenerUsuarios } = require('../controllers/userController');
const { login } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para obtener todas las publicaciones
router.get('/posts', getPosts);

// Ruta para eliminar un usuario (solo accesible para administradores)
router.delete('/users/:id', authenticateUser, deleteUser);

// Ruta para obtener todos los usuarios
router.get('/', authenticateUser, obtenerUsuarios);

router.put('/:id/role', authenticateUser, cambiarRol);

module.exports = router;
