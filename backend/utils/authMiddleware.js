// utils/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para autenticar a cualquier usuario
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado, falta token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    req.user = user; // Guarda el usuario en la solicitud para usarlo en otros middlewares
    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

// Middleware para autenticar a un administrador
const authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, async () => {
    if (req.user.role !== 'admin') { // Verifica el rol del usuario
      return res.status(403).json({ message: 'Acceso denegado: permisos de administrador requeridos' });
    }
    next();
  });
};

module.exports = { authenticateUser, authenticateAdmin };
