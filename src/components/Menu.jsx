import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { 
  Menu as MenuIcon, 
  QuestionAnswer as QuestionAnswerIcon, 
  ShoppingCart as ShoppingCartIcon, 
  DirectionsCar as DirectionsCarIcon, 
  ExitToApp as ExitToAppIcon,
  AdminPanelSettings as AdminIcon 
} from "@mui/icons-material";
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
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role || '');
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
    <>
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
      <div className={`sidebar ${isOpen ? "open" : ""} ${className}`}>
        <div className="menu-header">
          <IconButton onClick={toggleSidebar} className="menu-toggle-btn">
            <MenuIcon />
          </IconButton>
        </div>
        <div className="sidebar-content">
          <div className={`title16 ${!isOpen ? "hidden" : ""}`}>MENU</div>
          <List>
            <ListItem button onClick={goToPreguntas}>
              <ListItemIcon><QuestionAnswerIcon /></ListItemIcon>
              {isOpen && <ListItemText primary="Preguntas" />}
            </ListItem>
            <ListItem button onClick={goToVentas}>
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              {isOpen && <ListItemText primary="Ventas" />}
            </ListItem>
            <ListItem button onClick={goToEstacionamiento}>
              <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
              {isOpen && <ListItemText primary="Estacionamiento" />}
            </ListItem>
            {userRole === "admin" && (
              <ListItem button onClick={goToAdminDashboard}>
                <ListItemIcon><AdminIcon /></ListItemIcon>
                {isOpen && <ListItemText primary="Vista Admin" />}
              </ListItem>
            )}
          </List>
          <div className={`title17 ${!isOpen ? "hidden" : ""}`}>NAVEGADOR PERSONAL</div>
          <List>
            <ListItem button onClick={goToTusVentas}>
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              {isOpen && <ListItemText primary="Tus Ventas" />}
            </ListItem>
            <ListItem button onClick={goToTusPreguntas}>
              <ListItemIcon><QuestionAnswerIcon /></ListItemIcon>
              {isOpen && <ListItemText primary="Tus Preguntas" />}
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              {isOpen && <ListItemText primary="Cerrar Sesión" />}
            </ListItem>
          </List>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
