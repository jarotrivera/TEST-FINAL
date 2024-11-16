import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "./RightPanel2.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RightPanel2 = ({ className = "" }) => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Verificar el tamaño de la pantalla y actualizar el estado
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Verificar al cargar la página
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Si la pantalla es pequeña, no renderizar el panel
  if (isSmallScreen) return null;

  return (
    <div className={`right-panel5 ${className}`}>
      <div className="panel-section2">
        <div className="panel-title">
          <div className="star-parent">
            <div className="top-views-label">
              <div className="lo-mas-vistos2">Lo Más Vistos</div>
            </div>
          </div>
          <div className="panel-title-child" />
        </div>
      </div>
      <div className="buttons-wrapper">
        <Button className="botonfinanzas" variant="secondary" onClick={() => navigate("/gastoscomunes")}>
          Finanzas Comunidad
        </Button>
        <Button className="botonAreasComunes" variant="secondary" onClick={() => navigate("/areas-comunes")}>
          Áreas Comunes
        </Button>
      </div>
      <div className="panel-section3">
        <div className="panel-title1">
          <div className="link-group">
            <div className="building-data-label">
              <div className="lo-mas-vistos2">Datos Asociados Al Edificio</div>
            </div>
          </div>
          <div className="panel-title-child" />
        </div>
        <div className="links1">
          <div className="link1">
            <h2 className="h23">{`• `}</h2>
            <a
              href="https://www.comunidadfeliz.cl/"
              className="httpswwwcomunidadfelizcl2"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.comunidadfeliz.cl/
            </a>
          </div>
          <div className="link1">
            <h2 className="h23">{`• `}</h2>
            <div className="geocentrogmailcom2">Geocentro@gmail.com</div>
          </div>
          <div className="link1">
            <h2 className="h23">{`• `}</h2>
            <div className="httpswwwcomunidadfelizcl2">Conserjería +569 6721 0892</div>
          </div>
        </div>
      </div>
    </div>
  );
};

RightPanel2.propTypes = {
  className: PropTypes.string,
};

export default RightPanel2;
