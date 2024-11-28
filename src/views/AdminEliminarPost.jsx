import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Menu';
import './AdminEliminarPost.css';
import { TextField, Dialog, DialogTitle, DialogContent, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdminEliminarPost = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-eliminar-post-container">
      <Sidebar />
      <div className="admin-eliminar-post-content">
        <h2>Eliminar Publicaciones</h2>
        
        {/* Buscador */}
        <div className="search-container">
          <TextField
            label="Buscar por nombre o departamento"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            fullWidth
          />
        </div>

        {/* Tabla */}
        <div className="table-container">
          <table className="admin-eliminar-post-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.departamento}</td>
                  <td>
                    <button
                      className="ver-publicaciones-button"
                      onClick={() => handleOpenPosts(user)}
                    >
                      Ver Publicaciones
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para ver publicaciones */}
        {selectedUser && (
          <Dialog open={postModalOpen} onClose={handleClosePosts} fullWidth maxWidth="sm">
            <DialogTitle className="dialog-title">
              Publicaciones de {selectedUser.nombre}
              <IconButton onClick={handleClosePosts} className="close-button"> 
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className="dialog-content">
              {selectedPosts.length > 0 ? (
                selectedPosts.map(post => (
                  <div key={post.id} className="admin-post-item">
                    <Typography><strong>{post.titulo}</strong></Typography>
                    <p>{post.descripcion}</p>
                    <button
                      className="delete-button"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Eliminar
                    </button>
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
