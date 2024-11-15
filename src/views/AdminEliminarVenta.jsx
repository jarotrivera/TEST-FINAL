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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      console.log("Datos obtenidos:", data);
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener los usuarios con ventas:', error);
    }
  };

  const handleUserClick = (user) => {
    console.log("Usuario seleccionado:", user);
    setSelectedUser(user && user.userVentas ? user : { ...user, userVentas: [] });
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteVenta = async (ventaId) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/ventas/${ventaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al eliminar la venta');
      }

      setSelectedUser((prevUser) => ({
        ...prevUser,
        userVentas: prevUser.userVentas.filter((venta) => venta.id !== ventaId),
      }));

      alert('Venta eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
      alert(error.message);
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
              {selectedUser.userVentas && selectedUser.userVentas.length > 0 ? (
                <ul>
                  {selectedUser.userVentas.map((venta) => (
                    <li key={venta.id}>
                      <h4>{venta.titulo}</h4>
                      <p>{venta.descripcion}</p>
                      <p>Precio: ${venta.precio}</p>
                      <button onClick={() => handleDeleteVenta(venta.id)} className="delete-button">Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay ventas disponibles</p>
              )}
            </Box>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminEliminarVenta;
