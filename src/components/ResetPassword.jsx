import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Manejar el cambio de los inputs
  const handleInputChange = (e) => {
    if (e.target.name === 'nuevaPassword') {
      setNuevaPassword(e.target.value);
    } else {
      setConfirmarPassword(e.target.value);
    }
  };

  // Función para enviar la nueva contraseña al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`https://forogeocentro-production.up.railway.app/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevaPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contraseña restablecida correctamente');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ocurrió un error. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="reset-password">
      <main className="content3">
        <div className="info-wrapper">
          <div className="info1">
            <h3 className="bienvenido-a-la">Restablecer Contraseña</h3>
            <div className="geocentro-el-foro">Ingresa tu nueva contraseña</div>
            <Form className="reset-form" onSubmit={handleSubmit}>
              <Form.Group className="input-full">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="nuevaPassword"
                  placeholder="Nueva contraseña"
                  value={nuevaPassword}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="input-full">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmarPassword"
                  placeholder="Confirmar contraseña"
                  value={confirmarPassword}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {message && <p style={{ color: 'green' }}>{message}</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <Button className="button-resize" type="submit">
                Restablecer Contraseña
              </Button>
              <Button
                className="button-resize mt-2"
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Volver al Login
              </Button>
            </Form>
          </div>
        </div>
        <img className="image-icon" alt="" src="/image@2x.png" />
      </main>
    </div>
  );
};

export default ResetPassword;
