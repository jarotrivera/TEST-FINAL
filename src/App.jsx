// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './views/Login';
import Registro from './views/Registro';
import AreasComunes from './views/AreasComunes';
import TusVentas from './views/TusVentas';
import Estacionamiento from './views/Estacionamiento';
import VistaHacerUnPost from './views/VistaHacerUnPost';
import VistaHacerUnaVenta from './views/VistaHacerUnaVenta';
import PaginaInicial from './views/PaginaInicial';
import TusPreguntas from './views/TusPreguntas';
import PaginaVentas from './views/PaginaVentas';
import GastosComunes from './views/GastosComunes';
import AdminGastos from './views/AdminGastos';
import AdminDashboard from './views/AdminDashboard';
import AdminEliminarUser from './views/AdminEliminarUser';
import AdminEliminarPost from './views/AdminEliminarPost';
import AdminEliminarVenta from './views/AdminEliminarVenta';
import AdminRoles from './views/AdminRoles';
import AdminReportes from './views/AdminReportes';
import Recuperar from './components/Recuperar';
import ResetPassword from './components/ResetPassword';
import AdminEliminarComentarios from './views/AdminEliminarComentarios';
import Comentarios from './views/Comentarios';

// Función para decodificar el token y obtener el rol
function decodeTokenRole(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload en base64
    return payload.role; // Retorna el rol del usuario si existe
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

function App() {
  const token = localStorage.getItem('token');
  const userRole = token ? decodeTokenRole(token) : null;
  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rutas protegidas */}
        {isAuthenticated ? (
          <Route element={<Layout userRole={userRole} onLogout={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              localStorage.removeItem('role');
            }} />}
          >
            <Route path="/" element={<Navigate to="/paginainicial" />} />
            <Route path="/paginainicial" element={<PaginaInicial />} />
            <Route path="/areas-comunes" element={<AreasComunes />} />
            <Route path="/tusventas" element={<TusVentas />} />
            <Route path="/estacionamiento" element={<Estacionamiento />} />
            <Route path="/vistahacerunpost" element={<VistaHacerUnPost />} />
            <Route path="/vistahacerunaventa" element={<VistaHacerUnaVenta />} />
            <Route path="/tuspreguntas" element={<TusPreguntas />} />
            <Route path="/paginaventas" element={<PaginaVentas />} />
            <Route path="/gastoscomunes" element={<GastosComunes />} />
            <Route path="/admin-gastos" element={<AdminGastos />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/admin-eliminar-user" element={<AdminEliminarUser />} />
            <Route path="/admin-eliminar-post" element={<AdminEliminarPost />} />
            <Route path="/admin-eliminar-venta" element={<AdminEliminarVenta />} />
            <Route path="/admin-roles" element={<AdminRoles />} />
            <Route path="/admin-reportes" element={<AdminReportes />} />
            <Route path="/admin-eliminar-comentarios" element={<AdminEliminarComentarios />} />
            <Route path="/comentarios/:postId" element={<Comentarios />} />
            {userRole === 'admin' && (
              <Route path="/registro" element={<Registro />} />
            )}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
