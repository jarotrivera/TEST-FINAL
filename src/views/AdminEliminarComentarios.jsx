import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener usuarios con comentarios');
      }

      const data = await response.json();

      // Verificar si la respuesta es un array y si tiene la estructura esperada
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        console.error('La respuesta no es un array válido');
        setUsuarios([]);
      }
    } catch (error) {
      console.error('Error al obtener usuarios con comentarios:', error);
      setUsuarios([]); // Asegurarse de que usuarios sea siempre un array
    }
  };

  useEffect(() => {
    fetchUsersWithComments();
  }, []);

  // Abrir el modal con los comentarios del usuario seleccionado
  const handleOpenComments = (user) => {
    setSelectedUser(user);
    setSelectedComments(user.comments || []); // Asegúrate de que siempre sea un array
    setCommentModalOpen(true);
  };

  const handleCloseComments = () => {
    setCommentModalOpen(false);
    setSelectedUser(null);
    setSelectedComments([]);
  };

  // Eliminar un comentario
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        // Actualizar la lista de comentarios localmente
        setSelectedComments(selectedComments.filter(comment => comment.id !== commentId));
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
          <Typography variant="h4" className="admin-title">Eliminar Comentarios</Typography>
          <div className="user-list">
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <div key={user.id} className="user-card" onClick={() => handleOpenComments(user)}>
                  <Typography variant="h6">{user.nombre}</Typography>
                  <Typography variant="body2">Departamento: {user.departamento}</Typography>
                  <Typography variant="body2">
                    Comentarios: {user.comments?.length || 0}
                  </Typography>
                </div>
              ))
            ) : (
              <p>No hay usuarios con comentarios</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal para mostrar comentarios */}
      <Dialog open={commentModalOpen} onClose={handleCloseComments}>
        <DialogTitle>Comentarios de {selectedUser?.nombre}</DialogTitle>
        <DialogContent className="dialog-content">
          {selectedComments?.length > 0 ? (
            selectedComments.map((comment, index) => (
              <div key={index} className="comment-content">
                <Typography variant="body1">
                  <strong>{comment.usuario?.nombre || 'Usuario'}:</strong> {comment.content}
                </Typography>
                <IconButton
                  className="delete-comment-button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ))
          ) : (
            <Typography variant="body2">No hay comentarios.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComments} color="secondary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminEliminarComentarios;
