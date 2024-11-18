const User = require('../models/userModel');
const Venta = require('../models/ventaModel');
const Post = require('../models/postModel');
const Comment = require('../models/Comment');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'nombre', 'email', 'departamento' ] });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// Eliminar venta
const deleteVenta = async (req, res) => {
  try {
    const venta = await Venta.destroy({ where: { id: req.params.id } });
    if (venta) {
      res.status(200).json({ message: 'Venta eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'Venta no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar venta', error });
  }
};
// Eliminar publicación
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica si la publicación existe
    const post = await Post.findByPk(id, { include: { model: Comment, as: 'comments' } });
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    // Elimina los comentarios asociados antes de eliminar la publicación
    if (post.comments.length > 0) {
      await Comment.destroy({ where: { postId: id } });
    }

    // Elimina la publicación
    await post.destroy();

    res.status(200).json({ message: 'Publicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).json({ message: 'Error al eliminar la publicación' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
// Obtener todas las publicaciones
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'titulo', 'descripcion', 'createdAt'],
      include: {
        model: User,
        as: 'usuario', // Usando el alias definido en la relación
        attributes: ['nombre', 'email'],
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener las publicaciones' });
  }
};
// Obtener todas las ventas
const getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll();
    res.status(200).json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ message: 'Error al obtener las ventas' });
  }
};

// Obtener todos los usuarios con sus publicaciones
const getUsersWithPosts = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'departamento'],
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: ['id', 'titulo', 'descripcion', 'createdAt'],
        },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios con publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener usuarios con publicaciones' });
  }
};

const getUsersWithVentas = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Venta,
        as: 'userVentas',
        attributes: ['id', 'titulo', 'descripcion', 'precio', 'createdAt']
      }],
      attributes: ['id', 'nombre', 'departamento', 'email']
    });

    console.log("Usuarios con ventas:", JSON.stringify(users, null, 2)); // Depuración
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios con ventas:", error);
    res.status(500).json({ message: "Error al obtener usuarios con ventas" });
  }
};

module.exports = { getUsersWithVentas };


// Eliminar un comentario por su ID
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    
    await comment.destroy();
    res.status(200).json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ message: 'Error al eliminar comentario' });
  }
};

// Obtener todos los usuarios junto con sus comentarios
const getUsersWithComments = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Comment,
          as: 'userComments',
          attributes: ['id', 'content', 'postId', 'createdAt'],
        },
      ],
    });

    // Mapeamos la respuesta para incluir la cantidad de comentarios
    const usersWithCommentCount = users.map(user => ({
      id: user.id,
      nombre: user.nombre,
      departamento: user.departamento,
      email: user.email,
      role: user.role,
      userComments: user.userComments || [],
      commentCount: user.userComments ? user.userComments.length : 0,
    }));

    res.json(usersWithCommentCount);
  } catch (error) {
    console.error('Error al obtener usuarios con comentarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios con comentarios' });
  }
};

module.exports = { getAllUsers, deleteVenta, deletePost, deleteUser, getAllPosts, getAllVentas, getUsersWithPosts, getUsersWithVentas, getUsersWithComments , deleteComment };
