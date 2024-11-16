const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Post = require('../models/postModel');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { nombre, email, password, departamento } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Guardar la contraseña directamente en texto plano (temporal para pruebas)
    const newUser = await User.create({
      nombre,
      email,
      password, // Guarda en texto plano para pruebas
      departamento,
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para obtener todas las publicaciones
const getPosts = async (req, res) => {
  try {
    console.log("Intentando obtener publicaciones...");
    const posts = await Post.findAll({
      include: {
        model: User,
        as: 'usuario',
        attributes: ['nombre'],
      },
    });
    console.log("Publicaciones obtenidas:", posts);
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    res.status(500).json({ message: "Error al obtener las publicaciones", error });
  }
};

// Función para eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
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

// Función para obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'role', 'departamento']
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Función para cambiar el rol de un usuario
const cambiarRol = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.role = role;
    await usuario.save();

    res.json({ mensaje: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar el rol:', error);
    res.status(500).json({ error: 'Error al cambiar el rol' });
  }
};

// Exportar todas las funciones correctamente
module.exports = {
  registerUser,
  getPosts,
  deleteUser,
  obtenerUsuarios,
  cambiarRol
};
