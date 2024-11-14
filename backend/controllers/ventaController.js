// controllers/ventaController.js
const Venta = require('../models/ventaModel');
const User = require('../models/userModel');
const sharp = require('sharp');

// Obtener todas las ventas
const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: User,
        as: 'VentaUser',
        attributes: ['nombre', 'departamento'], // Incluye 'departamento'
      },
    });
    const ventasWithUser = ventas.map(venta => ({
      ...venta.get(),
      usuarioNombre: venta.VentaUser ? venta.VentaUser.nombre : 'Usuario desconocido',
      departamento: venta.VentaUser ? venta.VentaUser.departamento : 'No especificado', // Incluye el departamento en la respuesta
    }));
    console.log('Ventas obtenidas:', ventasWithUser); // Log para verificar las ventas obtenidas
    res.status(200).json(ventasWithUser);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
};


// Obtener las ventas del usuario autenticado
const getUserVentas = async (req, res) => {
  const usuarioId = req.userId;
  try {
    const ventas = await Venta.findAll({
      where: { usuarioId },
      include: {
        model: User,
        as: 'VentaUser',
        attributes: ['nombre'],
      },
    });
    const userVentas = ventas.map(venta => ({
      ...venta.get(),
      usuarioNombre: venta.VentaUser ? venta.VentaUser.nombre : 'Usuario desconocido',
    }));
    console.log('Ventas del usuario obtenidas:', userVentas); // Log para verificar las ventas del usuario
    res.status(200).json(userVentas);
  } catch (error) {
    console.error('Error al obtener las ventas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las ventas del usuario', error });
  }
};

// Crear una venta
const createVenta = async (req, res) => {
  const { titulo, descripcion, precio, foto } = req.body;
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

    const newVenta = await Venta.create({
      titulo,
      descripcion,
      precio,
      foto: resizedImageBase64,
      usuarioId,
    });
    console.log('Venta creada:', newVenta); // Log para verificar la creación de la venta
    res.status(201).json({ message: 'Venta creada exitosamente', newVenta });
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ message: 'Error al crear la venta', error });
  }
};

// Editar una venta
const editVenta = async (req, res) => {
  const { titulo, descripcion, precio } = req.body;
  const ventaId = req.params.id;
  const usuarioId = req.userId;

  try {
    const venta = await Venta.findByPk(ventaId);
    if (!venta || venta.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta venta' });
    }
    venta.titulo = titulo || venta.titulo;
    venta.descripcion = descripcion || venta.descripcion;
    venta.precio = precio || venta.precio;
    await venta.save();

    console.log('Venta actualizada:', venta); // Log para verificar la actualización de la venta
    res.status(200).json({ message: 'Venta actualizada correctamente', venta });
  } catch (error) {
    console.error('Error al editar la venta:', error);
    res.status(500).json({ message: 'Error al editar la venta', error });
  }
};

// Eliminar una venta
const deleteVenta = async (req, res) => {
  const ventaId = req.params.id;
  const usuarioId = req.userId;

  try {
    const venta = await Venta.findByPk(ventaId);
    if (!venta || venta.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta venta' });
    }
    await venta.destroy();
    console.log('Venta eliminada:', ventaId); // Log para verificar la eliminación de la venta
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ message: 'Error al eliminar la venta', error });
  }
};

module.exports = { createVenta, getVentas, getUserVentas, editVenta, deleteVenta };
