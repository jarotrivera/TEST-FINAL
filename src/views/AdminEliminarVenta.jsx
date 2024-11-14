import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminEliminarVenta.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const AdminEliminarVenta = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsersWithVentas();
  }, []);

  const fetchUsersWithVentas = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/usersWithVentas', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Error: La respuesta no es un array');
      }
    } catch (error) {
      console.error('Error al obtener usuarios con ventas:', error);
    }
  };

  const handleUserClick = (user) => {
    if (user && user.ventasUsuario) {
      setSelectedUser(user);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteVenta = async (ventaId) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/ventas/${ventaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setSelectedUser((prevUser) => ({
          ...prevUser,
          ventasUsuario: prevUser.ventasUsuario.filter((venta) => venta.id !== ventaId),
        }));
        alert('Venta eliminada con éxito');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al eliminar la venta');
      }
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
      alert('Error al eliminar la venta');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-dashboard-content">
        <h2>Usuarios</h2>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="user-card" onClick={() => handleUserClick(user)}>
              <h3>{user.nombre}</h3>
              <p>Departamento: {user.departamento}</p>
            </div>
          ))
        ) : (
          <p>No hay usuarios con ventas</p>
        )}

        {selectedUser && (
          <Modal open={true} onClose={handleCloseModal}>
            <Box className="modal-content">
              <h2>Ventas de {selectedUser.nombre}</h2>
              {selectedUser.ventasUsuario && selectedUser.ventasUsuario.length > 0 ? (
                <ul>
                  {selectedUser.ventasUsuario.map((venta) => (
                    <li key={venta.id}>
                      <h4>{venta.titulo}</h4>
                      <p>{venta.descripcion}</p>
                      <p>Precio: ${venta.precio}</p>
                      <button onClick={() => handleDeleteVenta(venta.id)} className="delete-button">Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay ventas para este usuario</p>
              )}
            </Box>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminEliminarVenta;
