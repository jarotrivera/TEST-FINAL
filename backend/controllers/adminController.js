const User = require('../models/userModel');
const Venta = require('../models/ventaModel');
const Post = require('../models/postModel');
const Comment = require('../models/Comment');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'nombre', 'email'] });
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
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });
    if (post) {
      res.status(200).json({ message: 'Publicación eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'Publicación no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar publicación', error });
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

// Obtener todos los usuarios con sus ventas
const getUsersWithVentas = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'departamento'],
      include: [
        {
          model: Venta,
          as: 'ventasUsuario', // Alias correcto desde tu archivo associations.js
          attributes: ['id', 'titulo', 'descripcion', 'precio', 'createdAt'],
        },
      ],
    });

    // Asegúrate de devolver un array, incluso si está vacío
    res.status(200).json(users || []);
  } catch (error) {
    console.error('Error al obtener usuarios con ventas:', error);
    res.status(500).json({ message: 'Error al obtener usuarios con ventas' });
  }
};

// Obtener todos los usuarios con sus comentarios


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

const getUsersWithComments = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'departamento'],
      include: [
        {
          model: Comment,
          as: 'comentariosUsuario',
          attributes: ['id', 'content', 'postId', 'createdAt'],
          include: [
            {
              model: Post,
              as: 'postRelacionado',
              attributes: ['id', 'titulo']
            }
          ]
        }
      ]
    });

    // Validar si la respuesta es un array
    if (!Array.isArray(users)) {
      throw new Error('La respuesta no es un array');
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios con comentarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios con comentarios' });
  }
};

module.exports = { getUsersWithComments };




module.exports = { getAllUsers, deleteVenta, deletePost, deleteUser, getAllPosts, getAllVentas, getUsersWithPosts, getUsersWithVentas, getUsersWithComments , deleteComment };
