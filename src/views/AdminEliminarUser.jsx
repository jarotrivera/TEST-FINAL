import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import './AdminEliminarUser.css';

const AdminEliminarUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch de usuarios al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener todos los usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  // Función para eliminar un usuario por su ID
  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Actualizar la lista de usuarios después de eliminar uno
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  // Función para filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.departamento && user.departamento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-dashboard-content">
        <h2>Eliminar Usuarios</h2>

        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre, correo o departamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Tabla de usuarios */}
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Departamento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.departamento || 'N/A'}</td>
                  <td>
                    <IconButton
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEliminarUser;
