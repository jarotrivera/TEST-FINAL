const express = require('express');
const { authenticateAdmin } = require('../utils/authMiddleware');
const { deleteVenta, deletePost, getAllUsers, deleteUser, getAllPosts, getAllVentas, getUsersWithPosts, getUsersWithVentas, deleteComment } = require('../controllers/adminController');

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/users', authenticateAdmin, getAllUsers);

// Ruta para obtener todas las publicaciones
router.get('/posts', authenticateAdmin, getAllPosts);

router.get('/ventas', authenticateAdmin, getAllVentas);

// Ruta para eliminar ventas
router.delete('/ventas/:id', authenticateAdmin, deleteVenta);


// Ruta para eliminar publicaciones
router.delete('/posts/:id', authenticateAdmin, deletePost);

// Ruta para eliminar usuarios
router.delete('/users/:id', authenticateAdmin, deleteUser);

// Ruta para obtener todos los usuarios con sus publicaciones
router.get('/usersWithPosts', authenticateAdmin, getUsersWithPosts);

// Ruta para obtener todos los usuarios con sus ventas
router.get('/usersWithVentas', authenticateAdmin, getUsersWithVentas);
router.delete('/comments/:commentId', authenticateAdmin, deleteComment);

module.exports = router;
