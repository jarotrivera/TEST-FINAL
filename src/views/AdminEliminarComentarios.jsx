import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import { Dialog, DialogTitle, DialogContent, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import './AdminEliminarComentarios.css';

const AdminEliminarComentarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsersWithComments();
  }, []);

  const fetchUsersWithComments = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/users-with-comments', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios con comentarios:', error);
    }
  };

  const handleOpenComments = (user) => {
    setSelectedUser(user);
    setSelectedComments(user.userComments || []);
    setCommentModalOpen(true);
  };

  const handleCloseComments = () => {
    setCommentModalOpen(false);
    setSelectedUser(null);
    setSelectedComments([]);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');

      await fetch(`https://forogeocentro-production.up.railway.app/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setSelectedComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  const filteredUsers = usuarios.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-eliminar-comentarios-container">
      <Sidebar />
      <div className="admin-eliminar-comentarios-content">
        <h2>Eliminar Comentarios</h2>

        {/* Buscador */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o departamento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla de usuarios */}
        <table className="admin-eliminar-comentarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Comentarios</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.departamento}</td>
                  <td>{user.userComments.length}</td>
                  <td>
                    <Button variant="contained" onClick={() => handleOpenComments(user)}>Ver Comentarios</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay usuarios con comentarios</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal para mostrar comentarios */}
        {selectedUser && (
          <Dialog open={commentModalOpen} onClose={handleCloseComments} fullWidth maxWidth="sm">
            <DialogTitle className="dialog-title">
              Comentarios de {selectedUser.nombre}
              <IconButton onClick={handleCloseComments} className="close-button">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className="dialog-content">
              {selectedComments.length > 0 ? (
                selectedComments.map(comment => (
                  <div key={comment.id} className="admin-comment-item">
                    <Typography>{comment.content}</Typography>
                    <IconButton onClick={() => handleDeleteComment(comment.id)} className="delete-button">
                      <DeleteIcon color="error" />
                    </IconButton>
                  </div>
                ))
              ) : (
                <Typography>No hay comentarios.</Typography>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminEliminarComentarios;
