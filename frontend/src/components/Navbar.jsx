import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MonitorPlay, ClipboardList, PlusCircle, UserCheck } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', path: '/', icon: <MonitorPlay size={18} /> },
    { name: 'Nueva Incidencia', path: '/nueva-incidencia', icon: <PlusCircle size={18} /> },
    { name: 'Bandeja', path: '/bandeja', icon: <ClipboardList size={18} /> },
    { name: 'Mis Tareas', path: '/mis-tareas', icon: <UserCheck size={18} /> },
  ];

  const currentUser = localStorage.getItem('currentUser') || 'Carlos Tecnico';

  const handleUserChange = (e) => {
    localStorage.setItem('currentUser', e.target.value);
    window.location.reload(); 
  };

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
        
        <div style={{ marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <select 
            className="form-control" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
            value={currentUser}
            onChange={handleUserChange}
          >
            <option value="Carlos Tecnico">👤 Carlos</option>
            <option value="Ana Especialista">👤 Ana</option>
            <option value="Roberto Redes">👤 Roberto</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
