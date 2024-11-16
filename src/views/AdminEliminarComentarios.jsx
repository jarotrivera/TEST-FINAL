import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      const response = await fetch('https://forogeocentro-production.up.railway.app/api/admin/users-with-comments', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener usuarios con comentarios');
      }

      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener usuarios con comentarios:', error);
    }
  };

  useEffect(() => {
    fetchUsersWithComments();
  }, []);

  // Abrir el modal con los comentarios del usuario seleccionado
  const handleOpenComments = (user) => {
    console.log("Usuario seleccionado:", user);
    setSelectedUser(user);
    setSelectedComments(user.userComments || []);
    setCommentModalOpen(true);
  };

  // Cerrar el modal
  const handleCloseComments = () => {
    setCommentModalOpen(false);
    setSelectedUser(null);
    setSelectedComments([]);
  };

  // Eliminar un comentario como administrador
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el comentario');
      }

      // Actualizar la lista de comentarios después de eliminar
      setSelectedComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  return (
    <div className="admin-eliminar-comentarios">
      <div className="content4">
        <Sidebar />
        <div className="admin-content">
          <Typography variant="h4" className="admin-title">Tabla De Usuarios</Typography>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Comentarios</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.departamento}</td>
                    <td>{user.userComments.length}</td>
                    <td>
                      <Button variant="contained" color="primary" onClick={() => handleOpenComments(user)}>
                        Ver Comentarios
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay usuarios con comentarios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para mostrar comentarios */}
      {selectedUser && (
        <Dialog
          open={commentModalOpen}
          onClose={handleCloseComments}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Comentarios de {selectedUser.nombre}
            <IconButton onClick={handleCloseComments}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedComments.length > 0 ? (
              selectedComments.map((comment) => (
                <div key={comment.id} className="admin-comment-item">
                  <Typography className="admin-comment-text">
                    <strong>{selectedUser.nombre}</strong>: {comment.content}
                  </Typography>
                  <IconButton onClick={() => handleDeleteComment(comment.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
              ))
            ) : (
              <Typography>No hay comentarios.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseComments}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminEliminarComentarios;
