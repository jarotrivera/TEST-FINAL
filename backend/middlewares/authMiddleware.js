const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log("Token recibido en el backend para comentarios:", token);

  if (!token) {
    console.log("Token no encontrado");
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Configurar req.user para los controladores
    req.user = { id: user.id, role: user.role };
    console.log("Usuario autenticado:", req.user);
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user?.role !== 'admin') {
      console.error("Acceso denegado: no es administrador");
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores permitidos' });
    }
    next();
  });
};

module.exports = { authenticateUser, authenticateAdmin };
