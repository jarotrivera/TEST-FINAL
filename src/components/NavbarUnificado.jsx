import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Importamos el hook para navegación
import "./NavbarUnificado.css";

const NavbarUnificado = ({
  title,
  showVenta,
  showPregunta,
  showRegistro,
  showLogin,
}) => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Funciones de navegación
  const goToVenta = () => navigate("/vistahacerunaventa");
  const goToPregunta = () => navigate("/vistahacerunpost");
  const goToRegistro = () => navigate("/registro");
  const goToLogin = () => navigate("/login");

  return (
    <header className="navbar-unificado">
      <div className="nav-bar-content">
        <div className="logo2">
          <img
            className="logo-icon-11"
            loading="lazy"
            alt=""
            src="/logoicon-1.svg"
          />
          <a className="comunidad-geocentro6">
            <b>Comunidad Geocentro</b>
          </a>
        </div>
        <div className="page-title-container">
          <a className="title15">{title}</a>
        </div>
      </div>
      <div className="action-buttons">
        {showPregunta && (
          <Button
            className="botonpregunta"
            name="Hacer Una Pregunta"
            id="HacerUnaPregunta"
            variant="primary"
            onClick={goToPregunta}
          >
            <img src="/logoagregar.svg" alt="Agregar" className="icon" />
            Hacer Una Pregunta
          </Button>
        )}
        {showVenta && (
          <Button
            className="botonventa"
            name="Hacer Una Venta"
            id="HacerUnaVenta"
            variant="primary"
            onClick={goToVenta}
          >
            <img src="/carrito.svg" alt="Agregar" className="icon" />
            Hacer Una Venta
          </Button>
        )}
        {showRegistro && (
          <Button
            className="botonregistro"
            name="Registro"
            id="Registro"
            variant="primary"
            onClick={goToRegistro}
          >
            <img src="/user.svg" alt="Agregar" className="icon" />
            Registro
          </Button>
        )}
        {showLogin && (
          <Button
            className="botonlogin"
            name="Login"
            id="Login"
            variant="primary"
            onClick={goToLogin}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default NavbarUnificado;
