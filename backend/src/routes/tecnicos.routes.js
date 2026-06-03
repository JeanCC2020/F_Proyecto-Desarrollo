const express = require('express');
const tecnicosController = require('../controllers/tecnicos.controller');

const router = express.Router();

router.get('/', tecnicosController.listarTecnicos);

module.exports = router;