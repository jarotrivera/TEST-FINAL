import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminGastos.css';

const AdminGastos = () => {
  const [tablaTitulo, setTablaTitulo] = useState('');
  const [columnas, setColumnas] = useState(['Nombre', 'Monto', 'Descripción']);
  const [filas, setFilas] = useState([['', '', '']]);
  const [isEditingTitle, setIsEditingTitle] = useState(null);
  const [tablas, setTablas] = useState([]);

  useEffect(() => {
    fetchTablas();
  }, []);

  const fetchTablas = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/gastos');
      const data = await response.json();
      setTablas(data);
    } catch (error) {
      console.error('Error al obtener las tablas de gastos:', error);
    }
  };

  const agregarFila = () => setFilas([...filas, Array(columnas.length).fill('')]);
  const eliminarFila = () => setFilas(filas.slice(0, -1));

  const agregarColumna = () => {
    setColumnas([...columnas, `Columna ${columnas.length + 1}`]);
    setFilas(filas.map(fila => [...fila, '']));
  };

  const eliminarColumna = () => {
    if (columnas.length > 0) {
      setColumnas(columnas.slice(0, -1));
      setFilas(filas.map(fila => fila.slice(0, -1)));
    }
  };

  const handleInputChange = (filaIdx, colIdx, value) => {
    const nuevasFilas = [...filas];
    nuevasFilas[filaIdx][colIdx] = value;
    setFilas(nuevasFilas);
  };

  const handleGuardar = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/gastos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: tablaTitulo,
          columnas,
          filas,
        }),
      });

      if (response.ok) {
        alert('Gastos guardados correctamente');
        fetchTablas(); // Recargar la lista de tablas
      } else {
        alert('Error al guardar los gastos');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTitleEdit = (colIdx) => {
    setIsEditingTitle(colIdx);
  };

  const handleTitleChange = (colIdx, value) => {
    const nuevasColumnas = [...columnas];
    nuevasColumnas[colIdx] = value;
    setColumnas(nuevasColumnas);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(null);
  };

  const handleDeleteTable = async (id) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/gastos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Tabla eliminada con éxito');
        fetchTablas(); // Actualizar la lista de tablas después de eliminar
      } else {
        alert('Error al eliminar la tabla');
      }
    } catch (error) {
      console.error('Error al eliminar la tabla:', error);
    }
  };

  return (
    <div className="admin-gastos-container">
      <Sidebar />
      <h2>Crear Tabla de Gastos Comunes</h2>
      
      <input 
        type="text" 
        value={tablaTitulo} 
        onChange={(e) => setTablaTitulo(e.target.value)} 
        placeholder="Título de la tabla" 
        className="titulo-input"
      />

      <div className="button-container">
        <button onClick={agregarColumna}>Agregar Columna</button>
        <button onClick={agregarFila}>Agregar Fila</button>
        <button className="delete-button" onClick={eliminarColumna}>Eliminar Columna</button>
        <button className="delete-button" onClick={eliminarFila}>Eliminar Fila</button>
      </div>

      <div className="table-scrollable">
        <table className="gastos-table">
          <thead>
            <tr>
              {columnas.map((columna, idx) => (
                <th key={idx} onClick={() => handleTitleEdit(idx)}>
                  {isEditingTitle === idx ? (
                    <input
                      type="text"
                      value={columna}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      onBlur={handleTitleBlur}
                      autoFocus
                    />
                  ) : (
                    columna
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, filaIdx) => (
              <tr key={filaIdx}>
                {fila.map((dato, colIdx) => (
                  <td key={colIdx}>
                    <input
                      type="text"
                      value={dato}
                      onChange={(e) => handleInputChange(filaIdx, colIdx, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button id="guardar-button" onClick={handleGuardar}>Guardar</button>

      <div className="tables-list">
        <h3>Tablas Creadas</h3>
        {tablas.map((tabla) => (
          <div key={tabla.id} className="table-item">
            <span>{tabla.titulo}</span>
            <button onClick={() => handleDeleteTable(tabla.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGastos;
