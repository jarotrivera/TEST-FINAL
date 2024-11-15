const Comment = require('../models/Comment');
const User = require('../models/userModel');
const Post = require('../models/postModel');

// Obtener todos los comentarios de un post
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        { model: User, as: 'comentador', attributes: ['nombre'] },
        { model: Post, as: 'comentarioPost' }
      ],
    });
    res.json(comments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

// Agregar un comentario
exports.addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id; // Asegúrate de que el middleware de autenticación esté funcionando
    const newComment = await Comment.create({ content, userId, postId });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
};

// Eliminar un comentario por ID
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.destroy({ where: { id: commentId } });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
};
