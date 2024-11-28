import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/Menu";
import './AdminReportes.css';

const AdminReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [detallesVisibles, setDetallesVisibles] = useState({});

  // Función para obtener los reportes al cargar la página
  const fetchReportes = async () => {
    try {
      const response = await axios.get('https://forogeocentro-production.up.railway.app/api/reportes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        console.log('Reportes obtenidos:', response.data); // Log para verificar datos
        setReportes(response.data);
      } else {
        console.error('Error al obtener reportes:', response.status);
      }
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const handleEliminarPublicacion = async (postId) => {
    try {
      await axios.delete(`https://forogeocentro-production.up.railway.app/api/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Publicación eliminada correctamente');
      setReportes((prevReportes) => prevReportes.filter(reporte => reporte.id !== postId));
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      alert('Error al eliminar publicación');
    }
  };

  const handleEliminarReporte = async (postId) => {
    try {
      const response = await axios.delete(`https://forogeocentro-production.up.railway.app/api/reportes/${postId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        alert('Reporte eliminado correctamente');
        // Eliminar el reporte del estado local para actualizar la lista inmediatamente
        setReportes((prevReportes) => prevReportes.filter(reporte => reporte.id !== postId));
      } else {
        console.error('Error al eliminar reporte:', response.status);
      }
    } catch (error) {
      console.error("Error al eliminar reporte:", error);
    }
  };

  const toggleDetalles = (postId) => {
    setDetallesVisibles((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  return (
    <div className="admin-reportes-page">
      <Sidebar />
      <div className="admin-reportes-container">
        <h2>Publicaciones Reportadas</h2>
        {reportes.length > 0 ? (
          reportes.map((reporte) => (
            <div key={reporte.id} className="reporte-card">
              {/* Mostrar el nombre del usuario justo encima del título */}
              <p className="reporte-usuario">Usuario: {reporte.usuarioNombre || 'Desconocido'}</p>
              <div className="reporte-header">
                <h3 className="reporte-title">{reporte.titulo}</h3>
                <button 
                  className="detalles-button" 
                  onClick={() => toggleDetalles(reporte.id)}
                >
                  {detallesVisibles[reporte.id] ? 'Ocultar Detalles' : 'Ver Detalles'}
                </button>
              </div>
              {detallesVisibles[reporte.id] && (
                <div className="motivos-resumen">
                  {Object.entries(reporte.motivos).map(([motivo, cantidad]) => (
                    <p key={motivo}>{motivo}: {cantidad}</p>
                  ))}
                </div>
              )}
              <div className="reporte-actions">
                <button 
                  className="remove-report-button" 
                  onClick={() => handleEliminarReporte(reporte.id)}
                >
                  Eliminar Reporte
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleEliminarPublicacion(reporte.id)}
                >
                  Eliminar Publicación
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay publicaciones reportadas.</p>
        )}
      </div>
    </div>
  );
};

export default AdminReportes;
