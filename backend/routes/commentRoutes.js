// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');

// Ruta para obtener comentarios de un post
router.get('/post/:postId', getComments);
// Agregar un comentario
router.post('/', addComment);
// Eliminar un comentario por ID
router.delete('/:commentId', deleteComment);


module.exports = router;
