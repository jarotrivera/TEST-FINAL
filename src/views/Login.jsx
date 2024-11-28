import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://forogeocentro-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.usuario,
          password: formData.contraseña,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Verifica si el token y otros datos existen antes de guardarlos
        if (data.token && data.userId && data.role) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("role", data.role);
  
          console.log("Token, userId y role guardados en localStorage");
          console.log("userId:", data.userId, "role:", data.role);
  
          navigate("/paginainicial");
        } else {
          console.error("Datos incompletos recibidos del servidor");
          setError("Error en el servidor");
        }
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Ocurrió un error. Inténtalo nuevamente.");
    }
  };
  
  
  return (
    <div className="login">
      <main className="content3">
        <div className="info-wrapper">
          <div className="info1">
            <h3 className="bienvenido-a-la">Bienvenido A la Comunidad</h3>
            <div className="geocentro-el-foro">
              Geocentro El Foro Privado De Nuestra Comunidad
            </div>
            <Form className="login-form" onSubmit={handleSubmit}>
              <Form.Group className="input-full">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  id="Usuario"
                  placeholder="Usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="input-full">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña"
                  id="Contraseña"
                  placeholder="Contraseña"
                  value={formData.contraseña}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Button
                className="button-resize"
                name="Iniciar Sesion"
                id="IniciarSesion"
                variant="primary"
                type="submit"
              >
                Iniciar Sesión
              </Button>
            </Form>
            <p
              className="forgot-password-link"
              onClick={() => navigate('/recuperar')}
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', marginTop: '10px' }}
            >
              ¿Olvidaste tu contraseña?
            </p>
          </div>
        </div>
        <img className="image-icon" alt="" src="/image@2x.png" />
      </main>
    </div>
  );
};

export default Login;
