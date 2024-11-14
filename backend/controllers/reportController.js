const Report = require('../models/Report');
const Post = require('../models/postModel');
const User = require('../models/userModel');

// Función para obtener todas las publicaciones que tienen reportes activos
const obtenerReportes = async (req, res) => {
  try {
    const reportes = await Post.findAll({
      include: [
        {
          model: Report,
          as: 'reports',
          attributes: ['reason'],
          required: true // Asegura que solo obtengamos posts que tengan reportes
        },
        {
          model: User,
          as: 'usuario',
          attributes: ['nombre']
        }
      ]
    });

    // Verificar si realmente se obtuvieron reportes
    if (!reportes || reportes.length === 0) {
      return res.status(404).json({ message: 'No hay reportes disponibles' });
    }

    const publicacionesReportadas = reportes.map((post) => {
      const motivos = {};
      post.reports.forEach((report) => {
        if (motivos[report.reason]) {
          motivos[report.reason]++;
        } else {
          motivos[report.reason] = 1;
        }
      });

      return {
        id: post.id,
        titulo: post.titulo,
        usuarioNombre: post.usuario?.nombre || 'Usuario',
        motivos
      };
    });

    console.log('Publicaciones reportadas:', publicacionesReportadas); // Para depurar en la consola del backend
    res.json(publicacionesReportadas);
  } catch (error) {
    console.error('Error al obtener los reportes:', error);
    res.status(500).json({ error: 'Error al obtener los reportes' });
  }
};

// Función para eliminar un reporte específico por postId
const eliminarReporte = async (req, res) => {
  const { postId } = req.params;
  try {
    const reportesEliminados = await Report.destroy({ where: { postId } });
    if (reportesEliminados > 0) {
      res.json({ message: 'Reporte eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontraron reportes para eliminar' });
    }
  } catch (error) {
    console.error('Error al eliminar el reporte:', error);
    res.status(500).json({ error: 'Error al eliminar el reporte' });
  }
};

// Función para eliminar una publicación
const eliminarPublicacion = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    await post.destroy();
    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).json({ error: 'Error al eliminar la publicación' });
  }
};

// Función para crear un nuevo reporte
const crearReporte = async (req, res) => {
  const { postId } = req.params;
  const { reason } = req.body;
  try {
    const nuevoReporte = await Report.create({ reason, postId });
    res.status(201).json({ message: 'Reporte creado correctamente', reporte: nuevoReporte });
  } catch (error) {
    console.error('Error al crear el reporte:', error);
    res.status(500).json({ error: 'Error al crear el reporte' });
  }
};

// Exportar todas las funciones
module.exports = {
  obtenerReportes,
  eliminarReporte,
  eliminarPublicacion,
  crearReporte
};
