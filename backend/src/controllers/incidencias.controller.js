const incidenciasService = require('../services/incidencias.service');

const listarIncidencias = async (req, res) => {
  try {
    const incidencias = await incidenciasService.listarIncidencias();
    res.json(incidencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerIncidenciaPorId = async (req, res) => {
  try {
    const incidencia = await incidenciasService.obtenerIncidenciaPorId(req.params.id);
    res.json(incidencia);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};


const registrarIncidencia = async (req, res) => {
  try {
    const incidencia = await incidenciasService.registrarIncidencia(req.body);
    res.status(201).json(incidencia);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const actualizarIncidencia = async (req, res) => {
  try {
    const incidencia = await incidenciasService.actualizarIncidencia(
      req.params.id,
      req.body
    );

    res.json(incidencia);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  listarIncidencias,
  obtenerIncidenciaPorId,
  registrarIncidencia,
  actualizarIncidencia,
};