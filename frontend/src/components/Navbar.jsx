import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MonitorPlay, ClipboardList, PlusCircle, UserCheck, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userJson = localStorage.getItem('currentUser');
  const currentUser = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
    window.location.reload();
  };

  if (!currentUser) return null;

  // Filtrar opciones por rol (S042)
  const navItems = [
    { name: 'Inicio', path: '/', icon: <MonitorPlay size={18} />, roles: ['jefe', 'tecnico'] },
    { name: 'Nueva Incidencia', path: '/nueva-incidencia', icon: <PlusCircle size={18} />, roles: ['jefe', 'tecnico'] },
    { name: 'Bandeja', path: '/bandeja', icon: <ClipboardList size={18} />, roles: ['jefe'] },
    { name: 'Mis Tareas', path: '/mis-tareas', icon: <UserCheck size={18} />, roles: ['tecnico'] },
  ].filter(item => item.roles.includes(currentUser.rol));

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo_full.svg" alt="SoftCorporation Logo" style={{ height: '34px', width: 'auto' }} />
      </Link>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
        
        <div style={{ marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            👤 <strong>{currentUser.nombre}</strong> ({currentUser.rol === 'jefe' ? 'Jefe' : 'Técnico'})
          </span>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', height: 'auto' }}
            onClick={handleLogout}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
