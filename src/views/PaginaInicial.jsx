import React, { useEffect, useState, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import "./PaginaInicial.css";
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Avatar, Box, Modal } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';


const PaginaInicial = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPostId, setEditPostId] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();



  const reportReasons = [
    "Contenido Inapropiado",
    "Spam o Publicidad No Deseada",
    "Información Falsa o Engañosa",
    "Acoso o Intimidación",
    "Violación de Privacidad",
    "Contenido Ilegal",
    "Desorden en el Foro"
  ];

  useEffect(() => {
    const fetchPublicaciones = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://forogeocentro-production.up.railway.app:3000/api/posts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las publicaciones');
        }
        const data = await response.json();
        setPublicaciones(data.reverse());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, []);

  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setEditPostId(post.id);
    setEditTitle(post.titulo);
    setEditDescription(post.descripcion);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openEditModal = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditPostId(null);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  const handleEditSave = async () => {
    if (!editPostId) {
      console.error("No se ha seleccionado ninguna publicación para editar");
      return;
    }

    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/posts/${editPostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          titulo: editTitle,
          descripcion: editDescription,
        }),
      });

      if (response.ok) {
        setPublicaciones((prev) =>
          prev.map((post) =>
            post.id === editPostId
              ? { ...post, titulo: editTitle, descripcion: editDescription }
              : post
          )
        );
        closeEditModal();
      } else if (response.status === 401) {
        console.error('Error de autorización: no autorizado');
      } else {
        console.error('Error al editar la publicación:', response.statusText);
      }
    } catch (error) {
      console.error('Error al guardar los cambios de la publicación:', error);
    }
  };

  const handleDelete = async () => {
    if (editPostId) {
      try {
        const response = await fetch(`https://forogeocentro-production.up.railway.app/api/posts/${editPostId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          setPublicaciones(publicaciones.filter((post) => post.id !== editPostId));
        } else if (response.status === 401) {
          console.error('Error de autorización: no autorizado');
        } else {
          console.error('Error al eliminar la publicación:', response.statusText);
        }
      } catch (error) {
        console.error('Error al eliminar la publicación:', error);
      } finally {
        handleMenuClose();
      }
    } else {
      console.error('No se ha seleccionado ninguna publicación para eliminar');
    }
  };

  if (loading) {
    return <p>Cargando publicaciones...</p>;
  }

  const handleReportClick = (postId) => {
    setSelectedPostId(postId);
    setReportModalOpen(true);
    handleMenuClose(); // Cierra el menú desplegable al abrir el modal
  };
  
  
  const handleSelectReason = (reason) => {
    setSelectedReason(reason);
  };
  
  const handleReportSubmit = async () => {
    if (!selectedReason) return;
    try {
      await fetch(`https://forogeocentro-production.up.railway.app/api/posts/${selectedPostId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason: selectedReason })
      });
      alert('Reporte enviado correctamente');
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
    }
    setReportModalOpen(false);
    setSelectedReason('');
  };

return (
  <div className="pagina-inicial">
    <div className="content4">
    <div className="sidebar-sticky">
      <Sidebar />
      </div>
      <section className="main-content" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div className="pagina-inicial-container">
          <div className="pagina-inicial-scroll">
            <div className="posts">
              {error ? (
                <p>{error}</p>
              ) : publicaciones.length > 0 ? (
                publicaciones.map((publicacion) => (
                  <Card key={publicacion.id} className="pagina-inicial-card" variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2} className="pagina-inicial-header">
                        <Avatar src={publicacion.avatarUrl || "/perfiluser.png"} alt="Avatar" />
                        <Box ml={2} className="pagina-inicial-user-info">
                          <Typography variant="subtitle1" color="textSecondary">
                            {publicacion.usuarioNombre || 'Usuario'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" className="pagina-inicial-date">
                            {new Date(publicacion.createdAt).toLocaleDateString()} / Departamento: {publicacion.departamento}
                          </Typography>
                        </Box>
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleMenuOpen(e, publicacion)}
                          style={{ marginLeft: 'auto' }}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="h6" component="h2" className="pagina-inicial-title">
                        {publicacion.titulo}
                      </Typography>
                      <Typography variant="body1" component="p" className="pagina-inicial-content">
                        {publicacion.descripcion}
                      </Typography>
                      {publicacion.foto && (
                        <div className="pagina-inicial-image">
                          <img src={publicacion.foto} alt="Imagen de la publicación" />
                          <Button onClick={() => openImageModal(publicacion.foto)} color="primary" className="ver-imagen-boton">
                            Ver Imagen Completa
                          </Button>
                        </div>
                      )}
                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={openEditModal}>Editar Publicación</MenuItem>
                        <MenuItem onClick={handleDelete}>Eliminar Publicación</MenuItem>
                        <MenuItem onClick={() => handleReportClick(editPostId)}>Reportar Publicación</MenuItem>
                      </Menu>
                      {/* Botón para ver comentarios en la página separada */}
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/comentarios/${publicacion.id}`)}
                        style={{ marginTop: '10px' }}
                      >
                        Ver Comentarios
                      </Button>

                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="no-posts-message">
                  <Typography variant="body2">No hay publicaciones disponibles.</Typography>
                </div>
              )}
            </div>
          </div>
        </div>
        <RightPanel2 className="right-panel-container" />
      </section>
    </div>
      {/* Modal para ver la imagen completa */}
      <Modal open={imageModalOpen} onClose={closeImageModal}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', position: 'relative' }}>
          <IconButton onClick={closeImageModal} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
            <CloseIcon />
          </IconButton>
          <img src={selectedImage} alt="Imagen Completa" style={{ maxWidth: '90%', maxHeight: '90%' }} />
        </Box>
      </Modal>

      <Dialog open={editModalOpen} onClose={closeEditModal}>
        <DialogTitle>Editar Publicación</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={reportModalOpen} onClose={() => setReportModalOpen(false)}>
  <DialogTitle>Reportar Publicación</DialogTitle>
  <DialogContent>
    {reportReasons.map((reason) => (
      <div
        key={reason}
        onClick={() => handleSelectReason(reason)}
        className="report-option"
        style={{ backgroundColor: selectedReason === reason ? '#87CEEB' : '#fff', cursor: 'pointer', padding: '10px', marginBottom: '5px', borderRadius: '5px' }}
      >
        {reason}
      </div>
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setReportModalOpen(false)}>Cancelar</Button>
    <Button onClick={handleReportSubmit} disabled={!selectedReason}>Reportar</Button>
  </DialogActions>
</Dialog>
</div>
);
};

export default PaginaInicial;
