// controllers/postController.js
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/Comment');
const sharp = require('sharp');

// Obtener todas las publicaciones
const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        as: 'usuario', 
        attributes: ['nombre', 'departamento'], // Incluye nombre y departamento
      },
    });

    const postsWithUserDetails = posts.map(post => ({
      id: post.id,
      titulo: post.titulo,
      foto: post.foto,
      descripcion: post.descripcion,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      usuarioNombre: post.usuario ? post.usuario.nombre : 'Usuario desconocido',
      departamento: post.usuario ? post.usuario.departamento : 'Sin departamento',
    }));

    res.status(200).json(postsWithUserDetails);
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    res.status(500).json({ message: "Error al obtener las publicaciones", error });
  }
};

// Obtener las publicaciones del usuario autenticado
// Obtener las publicaciones del usuario autenticado
const getUserPosts = async (req, res) => {
  const usuarioId = req.user.id; // Cambiado de req.userId a req.user.id

  try {
    const posts = await Post.findAll({
      where: { usuarioId },
      include: {
        model: User,
        as: 'usuario',
        attributes: ['nombre', 'departamento'],
      },
    });

    const userPosts = posts.map(post => ({
      id: post.id,
      titulo: post.titulo,
      foto: post.foto,
      descripcion: post.descripcion,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      usuarioNombre: post.usuario ? post.usuario.nombre : 'Usuario desconocido',
      departamento: post.usuario ? post.usuario.departamento : 'Sin departamento',
    }));

    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error al obtener las publicaciones del usuario:", error);
    res.status(500).json({ message: "Error al obtener las publicaciones del usuario", error });
  }
};


// Crear una nueva publicación
const createPost = async (req, res) => {
  try {
    const { titulo, descripcion, foto } = req.body;

    // Verifica que el usuario esté autenticado y que `req.user` esté disponible
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const newPost = await Post.create({
      titulo,
      descripcion,
      foto,
      usuarioId: req.user.id // Utiliza `req.user.id`
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ message: 'Error al crear la publicación', error });
  }
};



// Editar una publicación
// Editar una publicación
const editPost = async (req, res) => {
  const { titulo, descripcion } = req.body;
  const postId = req.params.id;

  try {
    const post = await Post.findByPk(postId);

    // Verifica que `req.user` y `req.user.id` estén disponibles
    if (!post || post.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
    }

    post.titulo = titulo || post.titulo;
    post.descripcion = descripcion || post.descripcion;
    await post.save();

    res.status(200).json({ message: 'Publicación actualizada correctamente', post });
  } catch (error) {
    console.error('Error al editar la publicación:', error);
    res.status(500).json({ message: 'Error al editar la publicación', error });
  }
};


// Eliminar una publicación
const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findByPk(postId);

    // Verifica que `req.user` y `req.user.id` estén disponibles
    if (!post || post.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).json({ message: 'Error al eliminar la publicación', error });
  }
};

// Obtener un post por su ID
const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: {
        model: User,
        as: 'usuario',
        attributes: ['nombre', 'departamento'],
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const postWithUserDetails = {
      id: post.id,
      titulo: post.titulo,
      descripcion: post.descripcion,
      foto: post.foto,
      usuarioNombre: post.usuario ? post.usuario.nombre : 'Usuario desconocido',
      departamento: post.usuario ? post.usuario.departamento : 'Sin departamento',
    };

    res.status(200).json(postWithUserDetails);
  } catch (error) {
    console.error('Error al obtener el post:', error);
    res.status(500).json({ message: 'Error al obtener el post', error });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  editPost,
  deletePost,
  getPostById, // Asegúrate de exportar esta función
};
