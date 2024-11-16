import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import "./TusVentas.css";
import { Card, CardContent, Typography, Box, IconButton, Button, Modal } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

const TusVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch ventas del usuario autenticado
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No hay token disponible');
          return;
        }

        const response = await fetch('https://forogeocentro-production.up.railway.app/api/ventas/user', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al obtener tus ventas');
        }

        const data = await response.json();
        setVentas(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener tus ventas:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  // Modal para ver la imagen en tamaño completo
  const openImageModal = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  if (loading) {
    return <p>Cargando ventas...</p>;
  }

  return (
    <div className="tus-ventas">
      <div className="content5">
        <Menu />
        <section className="main-content1">
          <div className="scroll-container">
            <div className="cards-container">
              {error ? (
                <p>{error}</p>
              ) : ventas.length > 0 ? (
                ventas.map((venta) => (
                  <Card key={venta.id} className="venta-card" variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">
                          {venta.autorVenta?.nombre} / Departamento: {venta.autorVenta?.departamento}
                        </Typography>
                        <IconButton aria-label="more">
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      {/* Título de la venta */}
                      <Typography className="venta-titulo">
                        {venta.titulo}
                      </Typography>

                      {/* Descripción de la venta */}
                      <Typography className="venta-descripcion">
                        {venta.descripcion}
                      </Typography>

                      {/* Precio de la venta */}
                      <Typography className="venta-precio">
                        Precio: ${venta.precio}
                      </Typography>

                      {/* Imagen de la venta (si existe) */}
                      {venta.foto && (
                        <div className="venta-imagen">
                          <img src={venta.foto} alt="Producto" />
                          <Button onClick={() => openImageModal(venta.foto)} color="primary" style={{ marginTop: '10px' }}>
                            Ver Imagen Completa
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                ))
              ) : (
                <p className="no-ventas-message">No tienes ventas publicadas.</p>
              )}
            </div>
          </div>
        </section>
        <RightPanel2 />
      </div>

      {/* Modal para la imagen en tamaño completo */}
      <Modal open={imageModalOpen} onClose={closeImageModal}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', position: 'relative' }}>
          <IconButton onClick={closeImageModal} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
            <CloseIcon />
          </IconButton>
          <img src={selectedImage} alt="Imagen Completa" style={{ maxWidth: '90%', maxHeight: '90%' }} />
        </Box>
      </Modal>
    </div>
  );
};

export default TusVentas;
