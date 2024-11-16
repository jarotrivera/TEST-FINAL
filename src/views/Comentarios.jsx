import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Comentarios.css';
import Sidebar from '../components/Menu';
import RightPanel2 from '../components/RightPanel2';

const Comentarios = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Obtener el título del post
  const fetchPostTitle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPostTitle(data.titulo || `Post #${postId}`);
      } else {
        console.error('Error al obtener el título del post');
        setPostTitle(`Post #${postId}`);
      }
    } catch (error) {
      console.error('Error al obtener el título del post:', error);
    }
  };

  // Obtener los comentarios
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/comments/post/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Error al obtener comentarios');
      }
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  };

  // Verificar si los valores están en localStorage y actualizar el estado
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('role');

    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      console.warn("No se encontró userId en localStorage");
      navigate('/login');
    }

    if (storedUserRole) {
      setUserRole(storedUserRole);
    } else {
      console.warn("No se encontró role en localStorage");
      navigate('/login');
    }

    console.log("Usuario autenticado ID desde localStorage:", storedUserId);
    console.log("Rol del usuario desde localStorage:", storedUserRole);
  }, [navigate]);

  // Agregar un comentario
  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Inicia sesión para comentar.");
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId, content: newComment })
      });

      const data = await response.json();
      if (response.ok) {
        setComments([...comments, data]);
        setNewComment('');
      } else {
        alert('Error al agregar comentario');
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  // Eliminar un comentario
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
      } else {
        console.error('Error al eliminar comentario');
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  useEffect(() => {
    fetchPostTitle();
    fetchComments();
  }, [postId]);

  return (
    <div className="comentarios-page">
      <div className="content">
        <div className="sidebar-sticky">
          <Sidebar />
        </div>
        <section className="comentarios-container">
          <Typography variant="h5" className="comentarios-title">
            {postTitle ? `Comentarios para: ${postTitle}` : 'Cargando...'}
          </Typography>

          <div className="comentarios-list">
            {comments.map(comment => {
              console.log("Comentario ID:", comment.id);
              console.log("Usuario autenticado ID:", userId);
              console.log("Rol del usuario:", userRole);
              console.log("ID del comentador:", comment.comentador?.id);

              const canDelete = comment.comentador?.id === userId || userRole === 'admin';
              console.log("Puede eliminar:", canDelete);

              return (
                <div key={comment.id} className="comentario-item">
                  <div className="comentario-header">
                    <Typography className="comentario-autor">
                      {comment.comentador?.nombre || 'Usuario'}
                    </Typography>

                    {canDelete && (
                      <DeleteIcon
                        className="eliminar-icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Eliminar comentario"
                      />
                    )}
                  </div>
                  <Typography className="comentario-content">{comment.content}</Typography>
                </div>
              );
            })}
          </div>
          <div className="nuevo-comentario-fixed">
            <TextField
              fullWidth
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="nuevo-comentario-input"
            />
            <Button onClick={handleAddComment} className="comentar-btn">
              Comentar
            </Button>
            <Button className="volver-btn" onClick={() => navigate('/paginainicial')}>
              Volver
            </Button>
          </div>
        </section>
        <RightPanel2 />
      </div>
    </div>
  );
};

export default Comentarios;
