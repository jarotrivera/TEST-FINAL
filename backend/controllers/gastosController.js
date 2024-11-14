
// controllers/gastosController.js
const GastosTable = require('../models/GastosTable');
const GastosTableCells = require('../models/GastosTableCells');


// Crear una nueva tabla de gastos y sus celdas
const createGastosTable = async (req, res) => {
  try {
    const { titulo, descripcion, columnas, filas } = req.body;

    // Crear la tabla principal con las columnas personalizadas
    const nuevaTabla = await GastosTable.create({ titulo, descripcion, columnas });

    // Crear las celdas para la tabla
    const celdas = [];
    filas.forEach((fila, filaIdx) => {
      fila.forEach((contenido, colIdx) => {
        celdas.push({
          tablaId: nuevaTabla.id,
          fila: filaIdx,
          columna: colIdx,
          contenido,
        });
      });
    });

    // Guardar las celdas en la base de datos
    await GastosTableCells.bulkCreate(celdas);

    res.status(201).json(nuevaTabla);
  } catch (error) {
    console.error('Error al crear la tabla de gastos:', error);
    res.status(500).json({ message: 'Error al crear la tabla de gastos' });
  }
};

// controllers/gastosController.js

// Agregar una celda a una tabla de gastos
const addCellToTable = async (req, res) => {
    try {
      const { tablaId } = req.params;
      const { fila, columna, contenido } = req.body;
  
      const nuevaCelda = await GastosTableCells.create({
        tablaId,
        fila,
        columna,
        contenido,
      });
  
      res.status(201).json(nuevaCelda);
    } catch (error) {
      console.error('Error al agregar la celda a la tabla:', error);
      res.status(500).json({ message: 'Error al agregar la celda' });
    }
};

// Obtener todas las tablas de gastos con sus celdas
const getGastosTables = async (req, res) => {
  try {
    const tablas = await GastosTable.findAll({
      include: [
        {
          model: GastosTableCells,
          as: 'celdas',
          attributes: ['fila', 'columna', 'contenido'],
        },
      ],
    });

    const tablasEstructuradas = tablas.map((tabla) => {
      const filas = [];
      tabla.celdas.forEach((celda) => {
        if (!filas[celda.fila]) filas[celda.fila] = [];
        filas[celda.fila][celda.columna] = celda.contenido;
      });

      return {
        id: tabla.id,
        titulo: tabla.titulo,
        columnas: tabla.columnas, // Utilizar los nombres de columnas guardados
        filas,
      };
    });

    res.json(tablasEstructuradas);
  } catch (error) {
    console.error('Error al obtener las tablas de gastos:', error);
    res.status(500).json({ message: 'Error al obtener las tablas de gastos' });
  }
};

// Función para eliminar una tabla de gastos y sus celdas
const deleteGastosTable = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Elimina primero las celdas asociadas a la tabla
    await GastosTableCells.destroy({ where: { tablaId: id } });
    
    // Elimina la tabla de gastos
    await GastosTable.destroy({ where: { id } });

    res.status(200).json({ message: 'Tabla eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la tabla de gastos:', error);
    res.status(500).json({ message: 'Error al eliminar la tabla de gastos' });
  }
};
  
module.exports = { createGastosTable, addCellToTable, getGastosTables, deleteGastosTable };