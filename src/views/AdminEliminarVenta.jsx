import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminEliminarVenta.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdminEliminarVenta = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedVentas, setSelectedVentas] = useState([]);
  const [ventaModalOpen, setVentaModalOpen] = useState(false);

  useEffect(() => {
    fetchUsersWithVentas();
  }, []);

  const fetchUsersWithVentas = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/usersWithVentas', {
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

  return (
    <div className="admin-eliminar-venta-container">
      <Sidebar />
      <div className="admin-eliminar-venta-content">
        <h2></h2>
        <table className="admin-eliminar-venta-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.departamento}</td>
                <td>
                  <Button variant="contained" onClick={() => handleOpenVentas(user)}>Ver Ventas</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedUser && (
          <Dialog open={ventaModalOpen} onClose={handleCloseVentas} fullWidth maxWidth="sm">
            <DialogTitle>
              Ventas de {selectedUser.nombre}
              <IconButton onClick={handleCloseVentas}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedVentas.length > 0 ? (
                selectedVentas.map(venta => (
                  <div key={venta.id} className="admin-venta-item">
                    <Typography><strong>{venta.titulo}</strong></Typography>
                    <p>{venta.descripcion}</p>
                    <Button variant="contained" color="error" onClick={() => handleDeleteVenta(venta.id)}>Eliminar</Button>
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
