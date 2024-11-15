// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { getCommentsByPostId, deleteComment } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ruta para obtener comentarios de un post
router.get('/post/:postId', verifyToken, getCommentsByPostId);

// Ruta para eliminar un comentario (solo admin)
router.delete('/:commentId', verifyToken, deleteComment);

module.exports = router;
