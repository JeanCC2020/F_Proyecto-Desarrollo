import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Monitor, User, Clock, CheckCircle, Wrench, Package, History, Send, ClipboardList } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';

const DetalleIncidencia = () => {
  const { id } = useParams();
  const [incidencia, setIncidencia] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Estados para formularios
  const [tecnicoId, setTecnicoId] = useState('');
  const [informe, setInforme] = useState('');
  const [repuesto, setRepuesto] = useState('');

  // Obtener roles reales (S042)
  const userJson = localStorage.getItem('currentUser');
  const currentUser = userJson ? JSON.parse(userJson) : null;
  const isJefe = currentUser?.rol === 'jefe';
  const isTecnico = currentUser?.rol === 'tecnico';

  const fetchData = () => {
    api.get(`/incidencias/${id}`)
      .then(data => {
        setIncidencia(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchTecnicos = () => {
    api.get('/tecnicos')
      .then(data => setTecnicos(data))
      .catch(err => console.error("Error cargando técnicos:", err));
  };

  useEffect(() => {
    fetchData();
    if (isJefe) {
      fetchTecnicos();
    }
  }, [id, isJefe]);

  const handleAction = (payload) => {
    setUpdating(true);
    api.patch(`/incidencias/${id}`, payload)
      .then(data => {
        setIncidencia(data);
        setUpdating(false);
        // Limpiar campos
        setTecnicoId('');
        setInforme('');
        setRepuesto('');
      })
      .catch(err => {
        alert("Error al actualizar: " + err.message);
        setUpdating(false);
      });
  };

  if (loading) return <div className="container-center mt-4">Cargando detalles...</div>;
  if (error) return <div className="container-center mt-4 text-danger">{error}</div>;

  return (
    <div className="container-center animate-fade-in">
      <Link to={isJefe ? "/bandeja" : "/mis-tareas"} className="btn btn-secondary mb-6">
        <ArrowLeft size={18} /> Volver a {isJefe ? "la Bandeja" : "Mis Tareas"}
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)' }}>
        
        {/* Lado Izquierdo: Detalles e Interacción */}
        <div className="flex-col" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          <header className="glass-panel">
            <div className="flex-between mb-6">
              <div>
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>Ticket #{incidencia.id}</span>
                <h1 className="heading-lg" style={{ margin: 0 }}>{incidencia.problema}</h1>
              </div>
              <StatusBadge estado={incidencia.estado} />
            </div>

            <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
              <div className="inner-panel flex-gap-2">
                <Monitor className="text-muted" size={20} />
                <div>
                  <p className="form-label">Equipo</p>
                  <p style={{ fontWeight: 600 }}>{incidencia.codigoEquipo}</p>
                </div>
              </div>
              <div className="inner-panel flex-gap-2">
                <User className="text-muted" size={20} />
                <div>
                  <p className="form-label">Usuario Responsable</p>
                  <p style={{ fontWeight: 600 }}>{incidencia.usuarioResponsable}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Secciones de Acción (Solo si corresponde) */}
          {isJefe && incidencia.estado === 'Pendiente' && (
            <section className="glass-panel">
              <h3 className="heading-md flex-gap-2"><User size={20}/> Asignar Técnico</h3>
              <div className="flex-gap-2 mt-4">
                <select 
                  className="form-control"
                  value={tecnicoId}
                  onChange={(e) => setTecnicoId(e.target.value)}
                >
                  <option value="">Seleccionar técnico...</option>
                  {tecnicos.map(t => (
                    <option key={t.id} value={t.id} disabled={t.tareas_actuales >= t.capacidad_maxima}>
                      {t.nombre} ({t.especialidad}) - Carga: {t.tareas_actuales}/{t.capacidad_maxima}
                    </option>
                  ))}
                </select>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAction({ tecnicoId })}
                  disabled={!tecnicoId || updating}
                >
                  {updating ? 'Asignando...' : 'Asignar'}
                </button>
              </div>
            </section>
          )}

          {isTecnico && 
           (incidencia.estado === 'Asignada' || incidencia.estado === 'En espera de repuesto') && 
           incidencia.tecnicoAsignado === currentUser?.nombre && (
            <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              <div className="inner-panel">
                <h3 className="heading-md flex-gap-2"><Wrench size={20}/> Registrar Informe Técnico</h3>
                <textarea 
                  className="form-control mt-4" 
                  placeholder="Describe la solución o diagnóstico..."
                  rows={3}
                  value={informe}
                  onChange={(e) => setInforme(e.target.value)}
                ></textarea>
                <button 
                  className="btn btn-primary mt-4"
                  onClick={() => handleAction({ informe, nuevoEstado: 'Resuelta' })}
                  disabled={!informe || updating}
                >
                  <CheckCircle size={18} /> Marcar como Resuelta
                </button>
              </div>

              <div className="inner-panel">
                <h3 className="heading-md flex-gap-2"><Package size={20}/> Solicitar Repuesto</h3>
                <div className="flex-gap-2 mt-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej: Memoria RAM 8GB"
                    value={repuesto}
                    onChange={(e) => setRepuesto(e.target.value)}
                  />
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleAction({ repuesto })}
                    disabled={!repuesto || updating}
                  >
                    <Send size={18} /> Solicitar
                  </button>
                </div>
              </div>
            </section>
          )}

          {incidencia.informeTecnico && (
            <section className="glass-panel">
              <h3 className="heading-md flex-gap-2"><ClipboardList size={20}/> Informe de Solución</h3>
              <div className="inner-panel mt-4" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                <p>{incidencia.informeTecnico}</p>
              </div>
            </section>
          )}
        </div>

        {/* Lado Derecho: Historial de Seguimiento */}
        <aside>
          <div className="glass-panel" style={{ position: 'sticky', top: '100px' }}>
            <h3 className="heading-md flex-gap-2 mb-6"><History size={20}/> Historial</h3>
            <div className="history-timeline">
              {incidencia.historial?.length > 0 ? (
                incidencia.historial.map((h, i) => (
                  <div key={i} className="history-item">
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{h.evento}</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {new Date(h.fecha).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted">Sin movimientos registrados.</p>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default DetalleIncidencia;
