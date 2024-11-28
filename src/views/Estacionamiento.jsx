import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import "./Estacionamiento.css";

const Estacionamiento = () => {
  const [espacios, setEspacios] = useState([
    { id: 1, ocupado: false },
    { id: 2, ocupado: false },
    { id: 3, ocupado: false },
    { id: 4, ocupado: false },
    { id: 5, ocupado: false },
    { id: 6, ocupado: false },
    { id: 7, ocupado: false },
    { id: 8, ocupado: false },
  ]);

  const actualizarEstadoEspacios = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/parking');
      const data = await response.json();

      setEspacios(prevEspacios =>
        prevEspacios.map((espacio, index) => ({
          ...espacio,
          ocupado: index === 0 ? data[0]?.ocupado : false // Solo actualiza el estado del primer bloque
        }))
      );
    } catch (error) {
      console.error('Error al obtener el estado de los espacios:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(actualizarEstadoEspacios, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pagina-inicial">
      <div className="content4">
        <Sidebar />
        <section className="main-content">
          {/* Indicadores de estado arriba centrados */}
          <div className="estado-container">
            <div className="estado libre"></div>
            <span>Estacionamiento Disponible</span>
            <div className="estado ocupado"></div>
            <span>Estacionamiento Ocupado</span>
          </div>

          <div className="estacionamiento-grid">
            {espacios.map((espacio, index) => (
              <div key={espacio.id} className={`espacio-contenedor ${index === 0 ? '' : 'desactivado'}`}>
                <div className="espacio">
                  <FontAwesomeIcon
                    icon={faCar}
                    className={`icono-carro ${index === 0 && espacio.ocupado ? 'ocupado' : index === 0 ? 'libre' : 'gris'}`}
                  />
                </div>
                <p className="etiqueta-estacionamiento">Estacionamiento {espacio.id}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Estacionamiento;
