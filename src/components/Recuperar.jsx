import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Recuperar.css"; 

const Recuperar = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para manejar el cambio en el campo de correo electrónico
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  // Función para enviar la solicitud de recuperación de contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://forogeocentro-production.up.railway.app/api/auth/recuperar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Correo enviado exitosamente. Revisa tu bandeja de entrada.");
        setEmail("");
      } else {
        const data = await response.json();
        setError(data.message || "Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Ocurrió un error. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="recuperar">
      <main className="content3">
        <div className="info-wrapper">
          <div className="info1">
            <h3 className="bienvenido-a-la">Recuperar Contraseña</h3>
            <div className="geocentro-el-foro">
              Ingresa tu correo para recuperar tu contraseña
            </div>
            <Form className="recuperar-form" onSubmit={handleSubmit}>
              <Form.Group className="input-full">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
              <Button className="button-resize" type="submit">
                Enviar Correo
              </Button>
              <Button
                className="button-resize mt-2"
                variant="secondary"
                onClick={() => navigate("/login")}
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

export default Recuperar;
