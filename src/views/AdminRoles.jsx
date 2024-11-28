import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Menu';
import './AdminRoles.css';

const AdminRoles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener la lista de usuarios al cargar la página
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('https://forogeocentro-production.up.railway.app/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  // Cambiar el rol del usuario seleccionado
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`https://forogeocentro-production.up.railway.app/api/users/${userId}/role`, { role: newRole }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsuarios(usuarios.map(user => user.id === userId ? { ...user, role: newRole } : user));
      alert('Rol actualizado correctamente');
    } catch (error) {
      console.error("Error al actualizar rol:", error);
    }
  };

  const filteredUsers = usuarios.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-roles-page">
      <Sidebar />

      <div className="admin-roles-container">
        <h2>Asignar Roles</h2>

        {/* Buscador */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla de usuarios */}
        <table className="roles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol Actual</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.role}</td>
                  <td>
                    <div className="role-select-container">
                      <select
                        value={selectedRole[usuario.id] || usuario.role}
                        onChange={(e) => setSelectedRole({ ...selectedRole, [usuario.id]: e.target.value })}
                        className="role-select"
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <button
                        onClick={() => handleRoleChange(usuario.id, selectedRole[usuario.id])}
                        disabled={selectedRole[usuario.id] === usuario.role || !selectedRole[usuario.id]}
                        className="assign-button"
                      >
                        Asignar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay usuarios que coincidan con la búsqueda</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoles;
