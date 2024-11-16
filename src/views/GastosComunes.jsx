import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import './GastosComunes.css';

const GastosComunes = () => {
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await fetch('https://forogeocentro-production.up.railway.app/api/gastos');
        if (!response.ok) throw new Error('Error al obtener los gastos comunes');
        const data = await response.json();
        setGastos(data);
      } catch (error) {
        console.error(error.message);
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
            {gastos.map((gasto) => (
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
            ))}
          </div>
        </section>
        <RightPanel2 />
      </main>
    </div>
  );
};

export default GastosComunes;
