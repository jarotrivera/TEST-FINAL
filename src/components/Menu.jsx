import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Menu as MenuIcon, QuestionAnswer as QuestionAnswerIcon, ShoppingCart as ShoppingCartIcon, DirectionsCar as DirectionsCarIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

const Sidebar = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
  
      // Si no hay un token, no hay necesidad de hacer la solicitud
      if (!token) {
        console.error("No hay token en localStorage");
        return;
      }
  
      try {
        const response = await fetch('https://forogeocentro-production.up.railway.app/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
          console.error("Error en la respuesta del servidor:", response.status);
          return;
        }
  
        const data = await response.json();
  
        // Verifica si el rol existe en la respuesta
        if (data && data.role) {
          setUserRole(data.role);
          console.log("Rol del usuario recibido:", data.role);
        } else {
          console.error("El rol no se encontró en la respuesta");
        }
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
      }
    };
  
    fetchUserRole();
  }, []);
  

  const toggleSidebar = () => setIsOpen(!isOpen);
  const goToEstacionamiento = () => navigate("/estacionamiento");
  const goToPreguntas = () => navigate("/paginainicial");
  const goToVentas = () => navigate("/paginaventas");
  const goToTusVentas = () => navigate("/tusventas");
  const goToTusPreguntas = () => navigate("/tuspreguntas");
  const goToAdminDashboard = () => navigate("/admindashboard");
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""} ${className}`}>
      <IconButton onClick={toggleSidebar} className="menu-toggle-btn">
        <MenuIcon />
      </IconButton>
      <div className="sidebar-content">
        <div className={`title16 ${!isOpen ? "hidden" : ""}`}>MENU</div>
        <List>
          <ListItem button onClick={goToPreguntas}>
            <ListItemIcon>
              <QuestionAnswerIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Preguntas" />}
          </ListItem>
          <ListItem button onClick={goToVentas}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Ventas" />}
          </ListItem>
          <ListItem button onClick={goToEstacionamiento}>
            <ListItemIcon>
              <DirectionsCarIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Estacionamiento" />}
          </ListItem>
          {userRole === "admin" && (
            <ListItem button onClick={goToAdminDashboard}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Vista Admin" />}
            </ListItem>
          )}
        </List>
        <div className={`title17 ${!isOpen ? "hidden" : ""}`}>NAVEGADOR PERSONAL</div>
        <List>
          <ListItem button onClick={goToTusVentas}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Tus Ventas" />}
          </ListItem>
          <ListItem button onClick={goToTusPreguntas}>
            <ListItemIcon>
              <QuestionAnswerIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Tus Preguntas" />}
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Cerrar Sesión" />}
          </ListItem>
        </List>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
