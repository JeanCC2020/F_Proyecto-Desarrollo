const tecnicosService = require('../services/tecnicos.service');

const listarTecnicos = async (req, res, next) => {
  try {
    const tecnicos = await tecnicosService.listarTecnicos();
    res.json(tecnicos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarTecnicos,
};