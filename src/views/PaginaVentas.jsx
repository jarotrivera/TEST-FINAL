import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import "./PaginaVentas.css";
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Modal } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

const PaginaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editVentaId, setEditVentaId] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', precio: '' });
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('https://forogeocentro-production.up.railway.app/api/ventas', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setVentas(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  const handleMenuOpen = (event, venta) => {
    setAnchorEl(event.currentTarget);
    setEditVentaId(venta.id);
    setFormData({ titulo: venta.titulo, descripcion: venta.descripcion, precio: venta.precio });
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
    setEditVentaId(null);
  };

  const handleEditSave = async () => {
    if (!editVentaId) return;

    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/ventas/${editVentaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setVentas((prev) =>
          prev.map((venta) => (venta.id === editVentaId ? { ...venta, ...formData } : venta))
        );
        closeEditModal();
      }
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
    }
  };

  const handleDelete = async () => {
    if (!editVentaId) return;

    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/ventas/${editVentaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        setVentas((prev) => prev.filter((venta) => venta.id !== editVentaId));
        handleMenuClose();
      }
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  return (
    <div className="pagina-ventas">
      <div className="content5">
        <Sidebar />
        <section className="main-content1">
          <div className="scroll-container">
            <div className="cards-container">
              {ventas.length > 0 ? (
                ventas.map((venta) => (
                  <Card key={venta.id} className="venta-card" variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">
                          {venta.autorVenta?.nombre} / Departamento: {venta.autorVenta?.departamento}
                        </Typography>
                        <IconButton 
                          aria-label="more"
                          onClick={(e) => handleMenuOpen(e, venta)} // Aquí pasamos el evento y la venta
                        >
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

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={openEditModal}>Editar Venta</MenuItem>
                      <MenuItem onClick={handleDelete}>Eliminar Venta</MenuItem>
                    </Menu>
                  </Card>
                ))
              ) : (
                <p className="no-ventas-message">No hay ventas disponibles.</p>
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

      {/* Modal para editar venta */}
      <Dialog open={editModalOpen} onClose={closeEditModal}>
        <DialogTitle>Editar Venta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Precio"
            type="number"
            fullWidth
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} color="secondary">Cancelar</Button>
          <Button onClick={handleEditSave} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaginaVentas;
