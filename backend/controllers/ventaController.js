// controllers/ventaController.js
const Venta = require('../models/ventaModel');
const User = require('../models/userModel');

// Obtener todas las ventas
const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: User,
        as: 'autorVenta', // Usa el alias correcto para la relación Venta -> User
        attributes: ['nombre', 'departamento']
      }
    });
    res.status(200).json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ message: "Error al obtener las ventas" });
  }
};


// Obtener todas las ventas del usuario autenticado
const getUserVentas = async (req, res) => {
  const usuarioId = req.user.id;
  try {
    const ventas = await Venta.findAll({
      where: { usuarioId },
      include: {
        model: User,
        as: 'autorVenta',
        attributes: ['nombre', 'departamento'],
      },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas del usuario:", error);
    res.status(500).json({ message: "Error al obtener las ventas del usuario" });
  }
};

// Crear una nueva venta
const createVenta = async (req, res) => {
  try {
    const { titulo, descripcion, precio, foto } = req.body;
    if (!req.user) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const newVenta = await Venta.create({
      titulo,
      descripcion,
      precio,
      foto,
      usuarioId: req.user.id,
    });

    res.status(201).json(newVenta);
  } catch (error) {
    console.error("Error al crear la venta:", error);
    res.status(500).json({ message: "Error al crear la venta" });
  }
};

// Editar una venta
const editVenta = async (req, res) => {
  const ventaId = req.params.id;
  const { titulo, descripcion, precio } = req.body;

  try {
    const venta = await Venta.findByPk(ventaId);
    if (!venta || venta.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta venta' });
    }

    venta.titulo = titulo || venta.titulo;
    venta.descripcion = descripcion || venta.descripcion;
    venta.precio = precio || venta.precio;
    await venta.save();

    res.status(200).json({ message: 'Venta actualizada correctamente', venta });
  } catch (error) {
    console.error("Error al editar la venta:", error);
    res.status(500).json({ message: "Error al editar la venta" });
  }
};

// Eliminar una venta
const deleteVenta = async (req, res) => {
  const ventaId = req.params.id;

  try {
    const venta = await Venta.findByPk(ventaId);
    if (!venta || venta.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta venta' });
    }

    await venta.destroy();
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    res.status(500).json({ message: "Error al eliminar la venta" });
  }
};

module.exports = {
  getVentas,
  getUserVentas,
  createVenta,
  editVenta,
  deleteVenta
};
