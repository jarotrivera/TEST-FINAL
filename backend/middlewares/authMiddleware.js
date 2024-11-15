const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtén el token del encabezado
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  try {
    // Verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id); // Busca el usuario en la base de datos

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user; // Establece el usuario en `req.user`
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({ message: 'Token no válido' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, async () => {
    if (req.user?.role !== 'admin') { // Verifica que `req.user` exista antes de acceder a `role`
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores permitidos' });
    }
    next();
  });
};

module.exports = { authenticateUser, authenticateAdmin };

