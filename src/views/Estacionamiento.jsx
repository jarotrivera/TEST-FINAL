import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import "./Estacionamiento.css";

const Estacionamiento = () => {
  // Estado para controlar si los espacios están ocupados o libres
  const [espacios, setEspacios] = useState([
    { id: 1, ocupado: false },
    { id: 2, ocupado: false },
    { id: 3, ocupado: false },
  ]);

  // Función para actualizar el estado de los espacios
  const actualizarEstadoEspacios = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/parking');
      const data = await response.json();
  
      setEspacios(prevEspacios =>
        prevEspacios.map((espacio, index) => ({
          ...espacio,
          ocupado: data[index] ? data[index].ocupado : false
        }))
      );
    } catch (error) {
      console.error('Error al obtener el estado de los espacios:', error);
    }
  };  

  useEffect(() => {
    // Llamar a la función para obtener el estado de los espacios cada 5 segundos
    const interval = setInterval(actualizarEstadoEspacios, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pagina-inicial">
      <div className="content4">
        <Sidebar />
        <section className="main-content">
          <div className="posts-container">
            <div className="estacionamiento-container">
              {espacios.map(espacio => (
                <div
                  key={espacio.id}
                  className={`espacio ${espacio.ocupado ? 'ocupado' : 'libre'}`}
                >
                  Espacio {espacio.id}
                </div>
              ))}
            </div>
          </div>
        </section>
        <RightPanel2 /> {/* Panel derecho */}
      </div>
    </div>
  );
};

export default Estacionamiento;
