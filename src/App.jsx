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
    if (!payload || !payload.exp || payload.exp < Date.now() / 1000) {
      console.error('Token expirado o inválido');
      return null;
    }
    return payload.role; // Retorna el rol del usuario si existe y el token es válido
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

// Componente de Ruta Protegida
function ProtectedRoute({ element, userRole, rolesPermitidos }) {
  if (!userRole) {
    return <Navigate to="/login" replace />; // Redirige al login si no hay usuario autenticado
  }
  if (rolesPermitidos && !rolesPermitidos.includes(userRole)) {
    return <Navigate to="/paginainicial" replace />; // Redirige si el rol del usuario no está permitido
  }
  return element;
}

function App() {
  const token = localStorage.getItem('token');
  const userRole = token ? decodeTokenRole(token) : null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirección a registro */}
        <Route path="/" element={<Layout userRole={userRole} />}> {/* Pasar el rol como prop */}
          <Route path="login" element={<Login />} />   
          <Route path="registro" element={<Registro userRole={userRole} rolesPermitidos={['admin']}/>} />
          <Route path="areas-comunes" element={<ProtectedRoute element={<AreasComunes />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="tusventas" element={<ProtectedRoute element={<TusVentas />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="estacionamiento" element={<ProtectedRoute element={<Estacionamiento />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="vistahacerunpost" element={<ProtectedRoute element={<VistaHacerUnPost />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="vistahacerunaventa" element={<ProtectedRoute element={<VistaHacerUnaVenta />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="paginainicial" element={<ProtectedRoute element={<PaginaInicial />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="tuspreguntas" element={<ProtectedRoute element={<TusPreguntas />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="paginaventas" element={<ProtectedRoute element={<PaginaVentas />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="gastoscomunes" element={<ProtectedRoute element={<GastosComunes />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
          <Route path="admin-gastos" element={<ProtectedRoute element={<AdminGastos />} userRole={userRole} rolesPermitidos={['admin']} />} />
          <Route path="admindashboard" element={<ProtectedRoute element={<AdminDashboard />} userRole={userRole} rolesPermitidos={['admin']} />} /> 
          <Route path="admin-eliminar-user" element={<ProtectedRoute element={<AdminEliminarUser />} userRole={userRole} rolesPermitidos={['admin']} />} />
          <Route path="admin-eliminar-post" element={<ProtectedRoute element={<AdminEliminarPost />} userRole={userRole} rolesPermitidos={['admin']} />} />
          <Route path="admin-eliminar-venta" element={<ProtectedRoute element={<AdminEliminarVenta />} userRole={userRole} rolesPermitidos={['admin']} />} />
          <Route path="admin-roles" element={<ProtectedRoute element={<AdminRoles />} userRole={userRole} rolesPermitidos={['admin']} />} />
          <Route path="admin-reportes" element={<ProtectedRoute element={<AdminReportes />} userRole={userRole} rolesPermitidos={['admin']} />} />
          <Route path="recuperar" element={<Recuperar />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="admin-eliminar-comentarios" element={<ProtectedRoute element={<AdminEliminarComentarios />} userRole={userRole} rolesPermitidos={['admin']} />} />
          <Route path="comentarios/:postId" element={<ProtectedRoute element={<Comentarios />} userRole={userRole} rolesPermitidos={['user', 'admin']} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
