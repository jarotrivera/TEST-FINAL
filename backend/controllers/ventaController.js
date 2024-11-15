// controllers/ventaController.js
const Venta = require('../models/ventaModel');
const User = require('../models/userModel');

// Obtener todas las ventas
const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: User,
        as: 'autorVenta',
        attributes: ['nombre', 'departamento']
      }
    });

    const ventasWithUser = ventas.map(venta => ({
      ...venta.get(),
      usuarioNombre: venta.autorVenta ? venta.autorVenta.nombre : 'Usuario desconocido',
      departamento: venta.autorVenta ? venta.autorVenta.departamento : 'No especificado'
    }));

    res.status(200).json(ventasWithUser);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ message: 'Error al obtener las ventas' });
  }
};

// Crear una venta
const createVenta = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Usar req.user.id
    const { titulo, descripcion, precio, foto } = req.body;

    const nuevaVenta = await Venta.create({
      titulo,
      descripcion,
      precio,
      foto,
      usuarioId
    });

    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ message: 'Error al crear la venta' });
  }
};

// Editar una venta
const editVenta = async (req, res) => {
  const { titulo, descripcion, precio } = req.body;
  const ventaId = req.params.id;
  const usuarioId = req.user.id;

  try {
    const venta = await Venta.findByPk(ventaId);
    if (!venta || venta.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta venta' });
    }

    venta.titulo = titulo || venta.titulo;
    venta.descripcion = descripcion || venta.descripcion;
    venta.precio = precio || venta.precio;
    await venta.save();

    res.status(200).json({ message: 'Venta actualizada correctamente', venta });
  } catch (error) {
    console.error('Error al editar la venta:', error);
    res.status(500).json({ message: 'Error al editar la venta' });
  }
};

// Eliminar una venta
const deleteVenta = async (req, res) => {
  const ventaId = req.params.id;
  const usuarioId = req.user.id;

  try {
    const venta = await Venta.findByPk(ventaId);
    if (!venta || venta.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta venta' });
    }

    await venta.destroy();
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ message: 'Error al eliminar la venta' });
  }
};

module.exports = {
  createVenta,
  getVentas,
  editVenta,
  deleteVenta
};
