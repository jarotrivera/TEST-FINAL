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
const getUserPosts = async (req, res) => {
  const usuarioId = req.userId;

  try {
    const posts = await Post.findAll({
      where: { usuarioId },
      include: {
        model: User,
        as: 'usuario',
        attributes: ['nombre', 'departamento'], // Incluye nombre y departamento
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

// Crear una publicación
const createPost = async (req, res) => {
  const { titulo, foto, descripcion } = req.body;
  const usuarioId = req.userId;

  try {
    let resizedImageBase64 = foto;

    if (foto) {
      const buffer = Buffer.from(foto.split(",")[1], 'base64'); 
      const resizedImage = await sharp(buffer)
        .resize({ width: 800 }) 
        .jpeg({ quality: 80 }) 
        .toBuffer();
      resizedImageBase64 = `data:image/jpeg;base64,${resizedImage.toString('base64')}`;
    }

    const newPost = await Post.create({
      titulo,
      foto: resizedImageBase64,
      descripcion,
      usuarioId,
    });
    res.status(201).json({ message: 'Publicación creada exitosamente', newPost });
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ message: 'Error al crear la publicación', error });
  }
};

// Editar una publicación
const editPost = async (req, res) => {
  const { titulo, descripcion } = req.body;
  const postId = req.params.id;
  const usuarioId = req.userId;

  try {
    const post = await Post.findByPk(postId);

    if (!post || post.usuarioId !== usuarioId) {
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
  const usuarioId = req.userId;

  try {
    const post = await Post.findByPk(postId);

    if (!post || post.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).json({ message: 'Error al eliminar la publicación', error });
  }
};


module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  editPost,
  deletePost,
};
