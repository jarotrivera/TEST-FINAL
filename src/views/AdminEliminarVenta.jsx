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
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener los usuarios con ventas:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
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
        // Actualiza el estado para eliminar la venta de la lista
        setSelectedUser((prevUser) => ({
          ...prevUser,
          ventas: prevUser.ventas.filter((venta) => venta.id !== ventaId),
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
        {users.map((user) => (
          <div key={user.id} className="user-card" onClick={() => handleUserClick(user)}>
            <h3>{user.nombre}</h3>
            <p>Departamento: {user.departamento}</p>
          </div>
        ))}

        {selectedUser && (
          <Modal open={true} onClose={handleCloseModal}>
            <Box className="modal-content">
              <h2>Ventas de {selectedUser.nombre}</h2>
              <ul>
                {selectedUser.ventas.map((venta) => (
                  <li key={venta.id}>
                    <h4>{venta.titulo}</h4>
                    <p>{venta.descripcion}</p>
                    <p>Precio: ${venta.precio}</p>
                    <button onClick={() => handleDeleteVenta(venta.id)} className="delete-button">Eliminar</button>
                  </li>
                ))}
              </ul>
            </Box>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminEliminarVenta;
