import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminGastos.css';

const AdminGastos = () => {
  const [tablaTitulo, setTablaTitulo] = useState('');
  const [columnas, setColumnas] = useState(['Nombre', 'Monto', 'Descripción']);
  const [filas, setFilas] = useState([['', '', '']]);
  const [isEditingTitle, setIsEditingTitle] = useState(null);
  const [tablas, setTablas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTablas();
  }, []);

  const fetchTablas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/gastos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('No autorizado. Verifique su token.');
        throw new Error(`Error al obtener las tablas: ${response.status}`);
      }
      const data = await response.json();
      setTablas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error al obtener las tablas:', error);
      setError(error.message);
      setTablas([]);
    }
  };

  const agregarFila = () => setFilas([...filas, Array(columnas.length).fill('')]);
  const eliminarFila = () => {
    if (filas.length > 0) {
      setFilas(filas.slice(0, -1)); // Elimina la última fila
    }
  };

  const agregarColumna = () => {
    setColumnas([...columnas, `Columna ${columnas.length + 1}`]);
    setFilas(filas.map((fila) => [...fila, ''])); // Añade una celda vacía en cada fila
  };
  const eliminarColumna = () => {
    if (columnas.length > 0) {
      setColumnas(columnas.slice(0, -1)); // Elimina la última columna
      setFilas(filas.map((fila) => fila.slice(0, -1))); // Elimina la última celda de cada fila
    }
  };

  const handleInputChange = (filaIdx, colIdx, value) => {
    const nuevasFilas = [...filas];
    nuevasFilas[filaIdx][colIdx] = value;
    setFilas(nuevasFilas);
  };

  const handleGuardar = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/gastos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Agregamos el token JWT
        },
        body: JSON.stringify({
          titulo: tablaTitulo,
          columnas,
          filas,
        }),
      });
  
      if (response.ok) {
        alert('Gastos guardados correctamente');
        fetchTablas(); // Recargar la lista de tablas
      } else if (response.status === 401) {
        alert('No autorizado. Verifique sus credenciales.');
      } else {
        alert('Error al guardar los gastos.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al intentar guardar los datos.');
    }
  };
  

  const handleDeleteTable = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/gastos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Tabla eliminada con éxito');
        fetchTablas();
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
        <button style={{ backgroundColor: 'red', color: 'white' }} onClick={eliminarColumna}>Eliminar Columna</button> {/* Botón rojo para eliminar columna */}
        <button onClick={agregarFila}>Agregar Fila</button>
        <button style={{ backgroundColor: 'red', color: 'white' }} onClick={eliminarFila}>Eliminar Fila</button> {/* Botón rojo para eliminar fila */}
      </div>

      <table className="gastos-table">
        <thead>
          <tr>
            {columnas.map((columna, idx) => (
              <th key={idx} onClick={() => setIsEditingTitle(idx)}>
                {isEditingTitle === idx ? (
                  <input
                    type="text"
                    value={columna}
                    onChange={(e) => {
                      const nuevasColumnas = [...columnas];
                      nuevasColumnas[idx] = e.target.value;
                      setColumnas(nuevasColumnas);
                    }}
                    onBlur={() => setIsEditingTitle(null)}
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

      <button id="guardar-button" onClick={handleGuardar}>Guardar</button>

      <div className="tables-list">
        <h3>Tablas Creadas</h3>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          Array.isArray(tablas) && tablas.length > 0 ? (
            tablas.map((tabla) => (
              <div key={tabla.id} className="table-item">
                <span>{tabla.titulo}</span>
                <button onClick={() => handleDeleteTable(tabla.id)}>Eliminar</button>
              </div>
            ))
          ) : (
            <p>No hay tablas disponibles.</p>
          )
        )}
      </div>
    </div>
  );
};

export default AdminGastos;
