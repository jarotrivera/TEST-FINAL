const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/post/:postId', authenticateUser, getComments);
router.post('/', authenticateUser, addComment); // Asegúrate de que esta ruta esté protegida
router.delete('/:commentId', authenticateUser, deleteComment);

module.exports = router;

