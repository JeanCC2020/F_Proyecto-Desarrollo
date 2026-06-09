const express = require('express');
const incidenciasController = require('../controllers/incidencias.controller');

const router = express.Router();

router.get('/', incidenciasController.listarIncidencias);
router.post('/', incidenciasController.registrarIncidencia);
router.get('/:id', incidenciasController.obtenerIncidenciaPorId);
router.patch('/:id', incidenciasController.actualizarIncidencia);


module.exports = router;