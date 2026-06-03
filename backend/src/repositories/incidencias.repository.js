const supabase = require('../config/supabase');

const findAll = async () => {
  return supabase
    .from('incidencias')
    .select('*, historial:historial_incidencias(*)')
    .order('fecha_hora', { ascending: false });
};

const findById = async (id) => {
  return supabase
    .from('incidencias')
    .select('*, historial:historial_incidencias(*)')
    .eq('id', id)
    .single();
};

const findEquipoByCodigo = async (codigoEquipo) => {
  return supabase
    .from('equipos')
    .select('*')
    .eq('codigo', codigoEquipo)
    .single();
};

const createIncidencia = async (incidencia) => {
  return supabase
    .from('incidencias')
    .insert([incidencia])
    .select()
    .single();
};

const createHistorialEvento = async (evento) => {
  return supabase
    .from('historial_incidencias')
    .insert([evento]);
};


const findBaseById = async (id) => {
  return supabase
    .from('incidencias')
    .select('*')
    .eq('id', id)
    .single();
};

const updateIncidencia = async (id, updateFields) => {
  return supabase
    .from('incidencias')
    .update(updateFields)
    .eq('id', id);
};

const createHistorialEventos = async (eventos) => {
  return supabase
    .from('historial_incidencias')
    .insert(eventos);
};

module.exports = {
  findAll,
  findById,
  findBaseById,
  findEquipoByCodigo,
  createIncidencia,
  updateIncidencia,
  createHistorialEvento,
  createHistorialEventos,
};