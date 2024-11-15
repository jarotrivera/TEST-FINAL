import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "./AdminEliminarComentarios.css";

const AdminEliminarComentarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  // Obtener todos los usuarios con sus comentarios
  const fetchUsersWithComments = async () => {
    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/users-with-comments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener usuarios con comentarios:', error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    fetchUsersWithComments();
  }, []);

  const handleOpenComments = (user) => {
    setSelectedUser(user);
    setSelectedComments(user.comments || []);
    setCommentModalOpen(true);
  };

  const handleCloseComments = () => {
    setCommentModalOpen(false);
    setSelectedUser(null);
    setSelectedComments([]);
  };

  // Eliminar un comentario como administrador
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setSelectedComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
        alert('Comentario eliminado exitosamente');
      } else {
        alert('Error al eliminar el comentario');
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  return (
    <div className="admin-eliminar-comentarios">
      <div className="content4">
        <Sidebar />
        <div className="admin-content">
          <Typography variant="h4" className="admin-title"></Typography>
          <div className="user-list">
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <div key={user.id} className="user-card" onClick={() => handleOpenComments(user)}>
                  <Typography variant="h6">{user.nombre}</Typography>
                  <Typography variant="body2">Departamento: {user.departamento}</Typography>
                  <Typography variant="body2">Comentarios: {user.comments?.length || 0}</Typography>
                </div>
              ))
            ) : (
              <div className="no-users-message">
                <Typography variant="body2">No hay usuarios con comentarios</Typography>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para mostrar comentarios */}
      {selectedUser && (
        <Dialog open={commentModalOpen} onClose={handleCloseComments} fullWidth maxWidth="sm">
          <DialogTitle>
            Comentarios de {selectedUser.nombre}
            <IconButton onClick={handleCloseComments} style={{ position: 'absolute', right: 10, top: 10 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="dialog-content">
            {selectedComments.length > 0 ? (
              selectedComments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <Typography className="comment-text">
                    <strong>{comment.usuario?.nombre || 'Usuario'}:</strong> {comment.content}
                  </Typography>
                  <button
                    className="delete-comment-button"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    ✖
                  </button>
                </div>
              ))
            ) : (
              <div className="no-comments-message">
                <Typography variant="body2">No hay comentarios.</Typography>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseComments} color="secondary">Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminEliminarComentarios;
