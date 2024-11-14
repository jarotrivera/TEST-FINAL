import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "./RightPanel2.css";
import { useNavigate } from "react-router-dom"; // Importar el hook useNavigate

const RightPanel2 = ({ className = "" }) => {
  const navigate = useNavigate(); // Usar el hook useNavigate para navegación

  const goToGastosComunes = () => {
    // Navegar a la ruta de gastos comunes
    navigate("/gastoscomunes");
  };

  const goToAreasComunes = () => {
    // Navegar a la ruta de áreas comunes
    navigate("/areas-comunes");
  };

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
        <Button className="botonfinanzas" variant="secondary" onClick={goToGastosComunes}>
          Finanzas Comunidad
        </Button>
        <Button className="botonAreasComunes" variant="secondary" onClick={goToAreasComunes}>
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
            <div className="httpswwwcomunidadfelizcl2">
              Conserjería +569 6721 0892
            </div>
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
