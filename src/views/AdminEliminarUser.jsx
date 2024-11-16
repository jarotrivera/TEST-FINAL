import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu'; 
import './AdminEliminarUser.css';

const AdminEliminarUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/users', {
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
  
  const handleDeleteUser = async (id) => {
    try {
      await fetch(`https://forogeocentro-production.up.railway.app/api/admin/users/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };
  

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-dashboard-content">
        <h2>Eliminar Usuarios</h2>
        <ul className="item-list">
          {users.map((user) => (
            <li key={user.id} className="item-card">
              {user.nombre} ({user.email})
              <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminEliminarUser;
