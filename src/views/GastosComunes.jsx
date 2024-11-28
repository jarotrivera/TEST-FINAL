import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import './GastosComunes.css';

const GastosComunes = () => {
  const [gastos, setGastos] = useState([]);
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/gastos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Envía el token JWT
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          if (response.status === 401) throw new Error('No autorizado. Verifique su token.');
          throw new Error(`Error al obtener los gastos comunes: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setGastos(data);
        } else {
          console.error('La respuesta no es un arreglo:', data);
          setGastos([]);
        }
      } catch (error) {
        console.error('Error al obtener los gastos comunes:', error.message);
        setError(error.message); // Almacena el mensaje de error
        setGastos([]); // Resetea los datos en caso de error
      }
    };

    fetchGastos();
  }, []);

  return (
    <div className="gastos-comunes">
      <main className="sidebar-and-table">
        <Sidebar />
        <section className="sidebar-and-table-content">
          <div className="table-container">
            {error ? (
              <div className="error-message">
                <p style={{ color: 'red' }}>{error}</p> {/* Muestra el mensaje de error */}
              </div>
            ) : (
              gastos.map((gasto) => (
                <div key={gasto.id} className="gastos-section">
                  <h2>{gasto.titulo}</h2> {/* Mostrar el título personalizado */}
                  <table className="gastos-table">
                    <thead>
                      <tr>
                        {gasto.columnas.map((columna, idx) => (
                          <th key={idx}>{columna}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {gasto.filas.map((fila, filaIdx) => (
                        <tr key={filaIdx}>
                          {fila.map((dato, colIdx) => (
                            <td key={colIdx}>{dato}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
        </section>
        <RightPanel2 />
      </main>
    </div>
  );
};

export default GastosComunes;
