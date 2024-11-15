// controllers/ventaController.js
const Venta = require('../models/ventaModel');
const User = require('../models/userModel');
const sharp = require('sharp');

const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: User,
        as: 'autorVenta', // Aquí usas el alias correcto
        attributes: ['nombre', 'departamento']
      }
    });

    // Asegúrate de utilizar el alias correcto al mapear los datos
    const ventasWithUser = ventas.map(venta => ({
      ...venta.get(),
      usuarioNombre: venta.autorVenta ? venta.autorVenta.nombre : 'Usuario desconocido',
      departamento: venta.autorVenta ? venta.autorVenta.departamento : 'No especificado'
    }));

    console.log('Ventas obtenidas:', ventasWithUser);
    res.status(200).json(ventasWithUser);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
};



const getUsersWithVentas = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Venta,
        as: 'userVentas', // Usa el alias correcto definido en tu asociación
        attributes: ['id', 'titulo', 'descripcion', 'precio', 'foto'],
      },
      attributes: ['id', 'nombre', 'departamento'],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios con ventas:', error);
    res.status(500).json({ message: 'Error al obtener usuarios con ventas' });
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

const getUserVentas = async (req, res) => {
  try {
    const userId = req.user.id; // Asegúrate de que `req.user.id` sea válido
    const ventas = await Venta.findAll({
      where: { usuarioId: userId },
      include: {
        model: User,
        as: 'autorVenta',
        attributes: ['nombre', 'departamento'],
      },
    });
    res.status(200).json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las ventas del usuario' });
  }
};


module.exports = { 
  createVenta, 
  getVentas, 
  getUserVentas, 
  getUsersWithVentas, 
  editVenta, 
  deleteVenta 
};
