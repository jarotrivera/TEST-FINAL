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

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://forogeocentro-production.up.railway.app/api/ventas/user', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          throw new Error('Error al obtener tus ventas');
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVentas(sortedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

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
                          {venta.usuarioNombre} / Departamento: {venta.departamento}
                        </Typography>
                        <IconButton aria-label="more">
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="h6" className="venta-titulo">
                        {venta.titulo}
                      </Typography>
                      <Typography className="venta-descripcion">
                        {venta.descripcion}
                      </Typography>
                      <Typography className="venta-precio">Precio: ${venta.precio}</Typography>
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
