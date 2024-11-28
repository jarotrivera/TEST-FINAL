import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminEliminarVenta.css';
import { Dialog, DialogTitle, DialogContent, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdminEliminarVenta = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedVentas, setSelectedVentas] = useState([]);
  const [ventaModalOpen, setVentaModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsersWithVentas();
  }, []);

  const fetchUsersWithVentas = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.appapi/admin/usersWithVentas', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios con ventas:', error);
    }
  };

  const handleOpenVentas = (user) => {
    setSelectedUser(user);
    setSelectedVentas(user.userVentas || []);
    setVentaModalOpen(true);
  };

  const handleCloseVentas = () => {
    setVentaModalOpen(false);
    setSelectedUser(null);
    setSelectedVentas([]);
  };

  const handleDeleteVenta = async (ventaId) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/ventas/${ventaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        setSelectedVentas((prevVentas) => prevVentas.filter(venta => venta.id !== ventaId));
        alert('Venta eliminada exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-eliminar-venta-container">
      <Sidebar />
      <div className="admin-eliminar-venta-content">
        <h2>Eliminar Ventas</h2>

        {/* Buscador */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o departamento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla de usuarios */}
        <table className="admin-eliminar-venta-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.departamento}</td>
                <td>
                  <Button
                    variant="contained"
                    className="ver-ventas-button"
                    onClick={() => handleOpenVentas(user)}
                  >
                    Ver Ventas
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para ver ventas */}
        {selectedUser && (
          <Dialog open={ventaModalOpen} onClose={handleCloseVentas} fullWidth maxWidth="sm">
            <DialogTitle className="dialog-title">
              Ventas de {selectedUser.nombre}
              <IconButton onClick={handleCloseVentas} className="close-button">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className="dialog-content">
              {selectedVentas.length > 0 ? (
                selectedVentas.map(venta => (
                  <div key={venta.id} className="admin-venta-item">
                    <Typography><strong>{venta.titulo}</strong></Typography>
                    <p>{venta.descripcion}</p>
                    <Button
                      variant="contained"
                      color="error"
                      className="delete-button"
                      onClick={() => handleDeleteVenta(venta.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))
              ) : (
                <p>No hay ventas.</p>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminEliminarVenta;
