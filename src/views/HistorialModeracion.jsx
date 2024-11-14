import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/Menu";
import "./HistorialModeracion.css";

const HistorialModeracion = () => {
  const [historial, setHistorial] = useState([]);

  const fetchHistorial = async () => {
    try {
      const response = await axios.get('https://forogeocentro-production.up.railway.app/api/historial', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setHistorial(response.data);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  return (
    <div className="historial-dashboard">
      {/* Menú lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="historial-main">
        <h2>Historial de Moderación</h2>
        <table className="historial-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Administrador</th>
              <th>Acción</th>
              <th>Tipo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>{item.User?.nombre || 'Admin'}</td>
                <td>{item.action}</td>
                <td>{item.targetType}</td>
                <td>{item.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialModeracion;
