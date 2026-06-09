import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegistrarIncidencia from './pages/RegistrarIncidencia';
import BandejaIncidencias from './pages/BandejaIncidencias';
import DetalleIncidencia from './pages/DetalleIncidencia';
import MisTareas from './pages/MisTareas';
import Login from './pages/Login';

// Componente para proteger las rutas (S044)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('currentUser');

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userJson);
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Si no tiene el rol permitido, redirigir al Dashboard principal según su rol
    return <Navigate to={user.rol === 'jefe' ? '/bandeja' : '/mis-tareas'} replace />;
  }

  return children;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        {/* Solo mostrar Navbar si el usuario está autenticado */}
        {token && <Navbar />}
        <main className="main-content">
          <Routes>
            {/* Ruta de Login */}
            <Route 
              path="/login" 
              element={token ? <Navigate to="/" replace /> : <Login />} 
            />

            {/* Rutas Protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['jefe', 'tecnico']}>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/nueva-incidencia" 
              element={
                <ProtectedRoute allowedRoles={['jefe', 'tecnico']}>
                  <RegistrarIncidencia />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bandeja" 
              element={
                <ProtectedRoute allowedRoles={['jefe']}>
                  <BandejaIncidencias />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/incidencia/:id" 
              element={
                <ProtectedRoute allowedRoles={['jefe', 'tecnico']}>
                  <DetalleIncidencia />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mis-tareas" 
              element={
                <ProtectedRoute allowedRoles={['tecnico']}>
                  <MisTareas />
                </ProtectedRoute>
              } 
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
