import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminEliminarPost.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const AdminEliminarPost = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsersWithPosts();
  }, []);

  const fetchUsersWithPosts = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/usersWithPosts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener los usuarios con publicaciones:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // Actualiza el estado para eliminar la publicación de la lista
        setSelectedUser((prevUser) => ({
          ...prevUser,
          posts: prevUser.posts.filter((post) => post.id !== postId),
        }));
        alert('Publicación eliminada con éxito');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al eliminar la publicación');
      }
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      alert('Error al eliminar la publicación');
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
              <h2>Publicaciones de {selectedUser.nombre}</h2>
              <ul>
                {selectedUser.posts.map((post) => (
                  <li key={post.id}>
                    <h4>{post.titulo}</h4>
                    <p>{post.descripcion}</p>
                    <button onClick={() => handleDeletePost(post.id)} className="delete-button">Eliminar</button>
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

export default AdminEliminarPost;
