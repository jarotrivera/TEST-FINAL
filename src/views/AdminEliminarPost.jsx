import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminEliminarPost.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdminEliminarPost = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [postModalOpen, setPostModalOpen] = useState(false);

  useEffect(() => {
    fetchUsersWithPosts();
  }, []);

  const fetchUsersWithPosts = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/usersWithPosts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios con publicaciones:', error);
    }
  };

  const handleOpenPosts = (user) => {
    setSelectedUser(user);
    setSelectedPosts(user.posts || []);
    setPostModalOpen(true);
  };

  const handleClosePosts = () => {
    setPostModalOpen(false);
    setSelectedUser(null);
    setSelectedPosts([]);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        setSelectedPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
        alert('Publicación eliminada exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
    }
  };

  return (
    <div className="admin-eliminar-post-container">
      <Sidebar />
      <div className="admin-eliminar-post-content">
        <h2></h2>
        <table className="admin-eliminar-post-table">
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
                  <Button variant="contained" onClick={() => handleOpenPosts(user)}>Ver Publicaciones</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedUser && (
          <Dialog open={postModalOpen} onClose={handleClosePosts} fullWidth maxWidth="sm">
            <DialogTitle>
              Publicaciones de {selectedUser.nombre}
              <IconButton onClick={handleClosePosts}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedPosts.length > 0 ? (
                selectedPosts.map(post => (
                  <div key={post.id} className="admin-post-item">
                    <Typography><strong>{post.titulo}</strong></Typography>
                    <p>{post.descripcion}</p>
                    <Button variant="contained" color="error" onClick={() => handleDeletePost(post.id)}>Eliminar</Button>
                  </div>
                ))
              ) : (
                <p>No hay publicaciones.</p>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminEliminarPost;
