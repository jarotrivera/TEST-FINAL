import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import NavbarUnificado from '../components/NavbarUnificado';

const Layout = () => {
  const location = useLocation();
  const { token } = useParams();

  // Configuración de rutas
  const routeConfig = {
    "/areas-comunes": {
      title: "Áreas Comunes",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/paginaventas": {
      title: "Página de Ventas",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/estacionamiento": {
      title: "Estacionamiento",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/paginainicial": {
      title: "Página Inicial",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/login": {
      title: "",
      showVenta: false,
      showPregunta: false,
      showRegistro: false,
      showLogin: true,
    },
    "/registro": {
      title: "",
      showVenta: false,
      showPregunta: false,
      showRegistro: true,
      showLogin: true,
    },
    "/tusventas": {
      title: "Tus Ventas",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/vistahacerunpost": {
      title: "Nueva Pregunta",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/vistahacerunaventa": {
      title: "Nueva Venta",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/tuspreguntas": {
      title: "Tus Preguntas",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/gastoscomunes": {
      title: "Finanzas",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/admindashboard": {
      title: "Panel De Administrador",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/admin-eliminar-user": {
      title: "Panel De Eliminación De Usuarios",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/admin-gastos": {
      title: "Panel De Administración Gastos Comunes",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/admin-eliminar-post": {
      title: "Panel De Eliminación De Publicaciones",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/admin-eliminar-venta": {
      title: "Panel De Eliminación De Ventas",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/historialmoderacion": {
      title: "Historial De Moderación",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/admin-roles": {
      title: "Panel De Asignación De Roles",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/admin-reportes": {
      title: "Panel De Reportes",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/recuperar": {
      title: "Recuperar Contraseña",
      showVenta: false,
      showPregunta: false,
      showRegistro: false,
      showLogin: true,
    },
    "/admin-eliminar-comentarios": {
      title: "Eliminar Comentarios",
      showVenta: true,
      showPregunta: true,
      showRegistro: false,
      showLogin: false,
    },
    "/reset-password/:token": {
      title: "Restablecer Contraseña",
      showVenta: false,
      showPregunta: false,
      showRegistro: false,
      showLogin: true,
    }
  };
  // Verificar si la ruta actual coincide con una ruta estática o dinámica
  const configKey = Object.keys(routeConfig).find(route => {
    const isDynamicRoute = route.includes(':token');
    if (isDynamicRoute) {
      const baseRoute = route.split('/:')[0];
      return location.pathname.startsWith(baseRoute);
    }
    return location.pathname === route;
  });

  const currentRoute = routeConfig[configKey] || {
    title: "Título por Defecto",
    showVenta: false,
    showPregunta: false,
    showRegistro: false,
    showLogin: false,
  };

  return (
    <>
      <NavbarUnificado
        title={currentRoute.title}
        showVenta={currentRoute.showVenta}
        showPregunta={currentRoute.showPregunta}
        showRegistro={currentRoute.showRegistro}
        showLogin={currentRoute.showLogin}
      />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
