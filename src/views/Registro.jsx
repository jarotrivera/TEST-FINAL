import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "./Registro.css";

const Registro = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    contraseña: "",
    repetirContraseña: "",
    departamento: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contraseña !== formData.repetirContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://forogeocentro-production.up.railway.app/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.usuario,
          email: formData.email,
          password: formData.contraseña,
          departamento: formData.departamento,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Usuario registrado con éxito.");
      } else {
        setError(data.message || "Error al registrar usuario.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un problema con el registro, intenta nuevamente.");
    }
  };

  return (
    <div className="registro">
      <div className="content-wrapper">
        <div className="info-wrapper">
          <div className="info1">
            <h3 className="registro-comunidad-geocentro">Registro Comunidad Geocentro</h3>
            <Form className="form" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  placeholder="Usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña"
                  placeholder="Contraseña"
                  value={formData.contraseña}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Repetir Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="repetirContraseña"
                  placeholder="Repetir Contraseña"
                  value={formData.repetirContraseña}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Número de Departamento</Form.Label>
                <Form.Control
                  type="number"
                  name="departamento"
                  placeholder="Número De Departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}
              <Button className="button-resize1" type="submit">
                Registro
              </Button>
            </Form>
          </div>
        </div>

        <div className="image-section">
          <img className="image-icon1" src="/image@2x.png" alt="Imagen de Bienvenida" />
        </div>
      </div>
    </div>
  );
};

export default Registro;
