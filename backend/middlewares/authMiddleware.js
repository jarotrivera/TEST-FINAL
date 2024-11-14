// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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

    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

module.exports = { authenticateUser };
