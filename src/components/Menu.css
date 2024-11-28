/* Sidebar */
.sidebar {
  width: 80px;
  position: fixed;
  top: 120px;
  left: 0;
  height: calc(100vh - 60px);
  z-index: 20000;
  transition: width 0.3s ease, box-shadow 0.3s ease;
  background-color: #ffffff;
  overflow-x: hidden;
  border-radius: 0 15px 15px 0;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.2); /* Sombra cuando está cerrado */
}

.sidebar.open {
  width: 300px;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3); /* Sombra más pronunciada cuando está abierto */
}

/* Overlay para cubrir el contenido */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1); /* Ajusta la opacidad si lo deseas */
  z-index: 15000; /* Justo por debajo del sidebar */
  display: none;
}

.sidebar.open + .overlay {
  display: block;
}

/* Contenedor del botón de menú */
.menu-header {
  position: relative;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

.menu-toggle-btn {
  cursor: pointer;
  color: #333;
}

/* Contenido del sidebar */
.sidebar-content {
  padding-top: 20px;
  padding-left: 15px;
}

.title16, .title17 {
  font-weight: bold;
  margin-top: 16px;
}

.hidden {
  display: none;
}

/* Ajustes para íconos */
.MuiListItemIcon-root {
  min-width: 40px;
}

.MuiListItemText-root {
  font-size: 16px;
}
/* --- Responsividad adicional para el Sidebar --- */

/* Pantallas medianas (tablets y pequeñas laptops) */
@media (max-width: 768px) {
  .sidebar {
    width: 60px; /* Reduce el ancho del sidebar en pantallas medianas */
    top: 80px; /* Ajusta la posición superior si es necesario */
  }

  .sidebar.open {
    width: 200px; /* Sidebar abierto ocupa menos espacio en pantallas medianas */
  }

  .menu-header {
    padding: 5px; /* Reduce el padding del encabezado del menú */
  }

  .sidebar-content {
    padding-left: 10px; /* Reduce el espacio de los contenidos */
  }

  .MuiListItemText-root {
    font-size: 14px; /* Reduce el tamaño de texto de los ítems */
  }
}

/* Pantallas pequeñas (teléfonos) */
@media (max-width: 480px) {
  .sidebar {
    width: 50px; /* Reduce aún más el ancho del sidebar */
    top: 60px; /* Ajusta la posición superior si es necesario */
  }

  .sidebar.open {
    width: 150px; /* Sidebar abierto ocupa menos espacio en pantallas pequeñas */
  }

  .menu-header {
    padding: 5px; /* Reduce el padding del encabezado */
  }

  .MuiListItemText-root {
    font-size: 12px; /* Reduce el tamaño de texto aún más */
  }

  .sidebar-content {
    padding-left: 8px; /* Menor espacio en el contenido */
  }

  .overlay {
    background: rgba(0, 0, 0, 0.2); /* Aumenta ligeramente la opacidad del overlay */
  }
}
