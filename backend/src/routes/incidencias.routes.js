const express = require('express');
const incidenciasController = require('../controllers/incidencias.controller');
const { validateRegistrarIncidencia, validateActualizarIncidencia } = require('../middleware/validation.middleware');

const router = express.Router();

router.get('/', incidenciasController.listarIncidencias);
router.post('/', validateRegistrarIncidencia, incidenciasController.registrarIncidencia);
router.get('/:id', incidenciasController.obtenerIncidenciaPorId);
router.patch('/:id', validateActualizarIncidencia, incidenciasController.actualizarIncidencia);


module.exports = router;