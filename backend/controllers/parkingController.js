let estadoEstacionamiento = {}; // Guarda el estado en la memoria del servidor

const actualizarEstadoEstacionamiento = (req, res) => {
  const { espacioId, ocupado } = req.body;

  if (espacioId === undefined || ocupado === undefined) {
    return res.status(400).json({ message: "Datos insuficientes" });
  }

  // Actualiza el estado del espacio
  estadoEstacionamiento[espacioId] = ocupado;
  console.log(`Espacio ${espacioId} está ${ocupado ? "ocupado" : "libre"}`);
  
  res.status(200).json({ message: `Estado del espacio ${espacioId} actualizado correctamente` });
};

const obtenerEstadoEstacionamiento = (req, res) => {
  const estadoArray = Object.keys(estadoEstacionamiento).map(id => ({
    id: parseInt(id),
    ocupado: estadoEstacionamiento[id]
  }));
  
  res.status(200).json(estadoArray);
};

module.exports = { actualizarEstadoEstacionamiento, obtenerEstadoEstacionamiento };
