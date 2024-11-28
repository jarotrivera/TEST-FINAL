import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
  });

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para el modal
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
      const response = await fetch("http://localhost:3000/api/auth/login", {
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
        if (data.token && data.userId && data.role) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("role", data.role);
          navigate("/paginainicial");
        } else {
          setError("Error en el servidor");
        }
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setError("Ocurrió un error. Inténtalo nuevamente.");
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
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
              onClick={() => navigate("/recuperar")}
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
                marginTop: "10px",
              }}
            >
              ¿Olvidaste tu contraseña?
            </p>
            <p
              className="rules-link"
              onClick={toggleModal}
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
                marginTop: "10px",
              }}
            >
              Reglamento de la comunidad
            </p>
          </div>
        </div>
        <img className="image-icon" alt="" src="/image@2x.png" />
      </main>

      {/* Modal de reglas */}
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reglamento de la Comunidad GeoCentro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              El respeto entre los miembros es primordial. No se permiten
              insultos, lenguaje ofensivo ni conductas discriminatorias.
            </li>
            <li>
              Las publicaciones deben estar relacionadas con temas relevantes
              para la comunidad, como anuncios de ventas, eventos o discusiones
              generales sobre el edificio.
            </li>
            <li>
              Las ventas realizadas deben ser legítimas, claras y completas. No
              se permiten fraudes ni productos ilícitos.
            </li>
            <li>
              Cualquier comentario o publicación ofensiva será eliminada de
              inmediato.
            </li>
            <li>
              El administrador se reserva el derecho de eliminar publicaciones
              o comentarios que incumplan las normas.
            </li>
            <li>
              Si un usuario infringe las reglas más de 3 veces, será eliminado
              permanentemente del foro, y sus publicaciones serán borradas.
            </li>
          </ul>
          <p>
            Al utilizar este foro, aceptas cumplir con estas reglas para
            garantizar un espacio seguro y respetuoso para todos.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
