const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Aquí configuramos 'req.user' para que el controlador pueda usarlo
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido' });
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

