import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import "./TusPreguntas.css";
import { Card, CardContent, Typography, Avatar, Box, Modal, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TusPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchPreguntas = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://forogeocentro-production.up.railway.app/api/posts/user-posts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener tus preguntas');
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPreguntas(sortedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
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
    return <p>Cargando preguntas...</p>;
  }

  return (
    <div className="tus-preguntas">
      <section className="main-content" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div className="tus-preguntas-container">
          <div className="sidebar">
            <Menu />
          </div>
          <div className="tus-preguntas-scroll">
            <div className="post-list">
              {error ? (
                <p>{error}</p>
              ) : Array.isArray(preguntas) && preguntas.length > 0 ? (
                preguntas.map((pregunta) => (
                  <Card key={pregunta.id} className="tus-preguntas-card" variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2} className="tus-preguntas-header">
                        <Avatar src={pregunta.avatarUrl || "/perfiluser.png"} alt="Avatar" className="tus-preguntas-avatar-container" />
                        <Box ml={2} className="tus-preguntas-user-info">
                          <Typography variant="subtitle1" color="textSecondary">
                            {pregunta.usuarioNombre || 'Usuario'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" className="tus-preguntas-date">
                            {new Date(pregunta.createdAt).toLocaleDateString()} / Departamento: {pregunta.departamento}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" component="h2" className="tus-preguntas-title">
                        {pregunta.titulo}
                      </Typography>
                      <Typography variant="body1" component="p" className="tus-preguntas-content">
                        {pregunta.descripcion}
                      </Typography>
                      {pregunta.foto && (
                        <div className="tus-preguntas-image">
                          <img src={pregunta.foto} alt="Imagen de la publicación" />
                          <Button onClick={() => openImageModal(pregunta.foto)} color="primary" style={{ marginTop: '10px' }}>
                            Ver Imagen Completa
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
              <div className="no-preguntas-message">
                <p>No hay preguntas disponibles.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <RightPanel2 />
      </section>

      {/* Modal para ver la imagen completa */}
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

export default TusPreguntas;
