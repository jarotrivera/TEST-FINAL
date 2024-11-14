// Asegúrate de que el nombre del archivo sea correcto
const Historial = require('../models/HistorialModeracion');
const User = require('../models/userModel');

// Controlador para obtener el historial de moderación
const obtenerHistorial = async (req, res) => {
  try {
    const historial = await Historial.findAll({
      include: [
        {
          model: User,
          attributes: ['nombre'],
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(historial);
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ message: 'Error al obtener el historial' });
  }
};

// Controlador para registrar una acción en el historial
const registrarAccion = async (userId, action, targetType, descripcion) => {
  try {
    await Historial.create({
      userId,
      action,
      targetType,
      descripcion,
    });
  } catch (error) {
    console.error('Error al registrar la acción en el historial:', error);
  }
};

// Exportar ambos controladores
module.exports = {
  obtenerHistorial,
  registrarAccion,
};
