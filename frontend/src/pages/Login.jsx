import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.post('/auth/login', { email, password });

      // Guardar sesión en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      // Redirigir según el rol del usuario (S041 / S042)
      if (data.user.rol === 'jefe') {
        navigate('/bandeja');
      } else if (data.user.rol === 'tecnico') {
        navigate('/mis-tareas');
      } else {
        navigate('/');
      }

      // Recargar para que el Navbar actualice el estado
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-center animate-fade-in" style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <div className="text-center mb-6">
        <img src="/logo_full.svg" alt="SoftCorporation Logo" style={{ height: '45px', marginBottom: '1rem' }} />
        <h2 className="heading-lg">Control de Acceso</h2>
        <p className="text-muted">Ingresa al sistema de gestión de soporte técnico</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@softcorp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }} 
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>

      <div className="glass-panel mt-6" style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Credenciales demo:</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', margin: 0 }}>
          <li><strong>Jefe:</strong> jefe@softcorp.com / jefe123</li>
          <li><strong>Técnico Carlos:</strong> carlos@softcorp.com / carlos123</li>
          <li><strong>Técnico Ana:</strong> ana@softcorp.com / ana123</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
