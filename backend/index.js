require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper para mapear incidencias de DB a Frontend
const mapIncidencia = (inc) => ({
  id: inc.id,
  codigoEquipo: inc.codigo_equipo,
  problema: inc.problema,
  usuarioResponsable: inc.usuario_responsable,
  registradoPor: inc.registrado_por,
  fechaHora: inc.fecha_hora,
  estado: inc.estado,
  tecnicoAsignado: inc.tecnico_asignado,
  informeTecnico: inc.informe_tecnico,
  repuestoSolicitado: inc.repuesto_solicitado,
  historial: inc.historial ? inc.historial.map(h => ({
    fecha: h.fecha,
    evento: h.evento
  })) : []
});

// Rutas
app.get('/api/incidencias', async (req, res) => {
  const { data, error } = await supabase
    .from('incidencias')
    .select('*, historial:historial_incidencias(*)')
    .order('fecha_hora', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(mapIncidencia));
});

app.get('/api/incidencias/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('incidencias')
    .select('*, historial:historial_incidencias(*)')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Incidencia no encontrada' });
  
  if (data.historial) {
    data.historial.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }
  
  res.json(mapIncidencia(data));
});

app.post('/api/incidencias', async (req, res) => {
  const { codigoEquipo, problema, usuarioResponsable, registradoPor } = req.body;
  
  // 1. Validar equipo
  const { data: equipo } = await supabase.from('equipos').select('*').eq('codigo', codigoEquipo).single();
  if (!equipo) return res.status(400).json({ error: `El equipo ${codigoEquipo} no existe en el inventario real.` });

  // 2. ID Único
  const timestamp = Date.now().toString().slice(-4);
  const newId = `INC-${timestamp}`;

  // 3. Insertar
  const { data, error } = await supabase
    .from('incidencias')
    .insert([{
      id: newId,
      codigo_equipo: codigoEquipo,
      problema,
      usuario_responsable: usuarioResponsable,
      registrado_por: registradoPor
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('historial_incidencias').insert([{ incidencia_id: newId, evento: 'Incidencia registrada' }]);

  res.status(201).json(mapIncidencia(data));
});

app.get('/api/tecnicos', async (req, res) => {
  const { data, error } = await supabase.from('tecnicos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.patch('/api/incidencias/:id', async (req, res) => {
  const { id } = req.params;
  const { tecnicoId, nuevoEstado, informe, repuesto } = req.body;

  const { data: incActual } = await supabase.from('incidencias').select('*').eq('id', id).single();
  if (!incActual) return res.status(404).json({ error: 'Incidencia no encontrada' });

  let updateFields = {};
  let logs = [];

  if (tecnicoId) {
    const { data: tec } = await supabase.from('tecnicos').select('*').eq('id', tecnicoId).single();
    if (!tec) return res.status(404).json({ error: 'Técnico no encontrado' });
    if (tec.tareas_actuales >= tec.capacidad_maxima) return res.status(400).json({ error: 'Capacidad máxima alcanzada' });

    if (incActual.tecnico_asignado) {
      const { data: pTec } = await supabase.from('tecnicos').select('*').eq('nombre', incActual.tecnico_asignado).single();
      if (pTec) await supabase.from('tecnicos').update({ tareas_actuales: pTec.tareas_actuales - 1 }).eq('id', pTec.id);
    }

    updateFields.tecnico_asignado = tec.nombre;
    updateFields.estado = 'Asignada';
    await supabase.from('tecnicos').update({ tareas_actuales: tec.tareas_actuales + 1 }).eq('id', tec.id);
    logs.push({ incidencia_id: id, evento: `Asignada a ${tec.nombre}` });
  }

  if (nuevoEstado) {
    updateFields.estado = nuevoEstado;
    logs.push({ incidencia_id: id, evento: `Estado cambiado a ${nuevoEstado}` });
    if ((nuevoEstado === 'Resuelta' || nuevoEstado === 'Cerrada') && incActual.tecnico_asignado) {
      const { data: tec } = await supabase.from('tecnicos').select('*').eq('nombre', incActual.tecnico_asignado).single();
      if (tec) await supabase.from('tecnicos').update({ tareas_actuales: tec.tareas_actuales - 1 }).eq('id', tec.id);
    }
  }

  if (informe) {
    updateFields.informe_tecnico = informe;
    logs.push({ incidencia_id: id, evento: 'Informe técnico registrado' });
  }

  if (repuesto) {
    updateFields.repuesto_solicitado = repuesto;
    updateFields.estado = 'En espera de repuesto';
    logs.push({ incidencia_id: id, evento: `Repuesto solicitado: ${repuesto}` });
  }

  await supabase.from('incidencias').update(updateFields).eq('id', id);
  if (logs.length > 0) await supabase.from('historial_incidencias').insert(logs);

  const { data: final } = await supabase.from('incidencias').select('*, historial:historial_incidencias(*)').eq('id', id).single();
  res.json(mapIncidencia(final));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend de soporte técnico con Supabase iniciado en puerto ${PORT}`);
});
