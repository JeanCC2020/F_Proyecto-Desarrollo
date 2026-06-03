const tecnicosService = require('../services/tecnicos.service');

const listarTecnicos = async (req, res) => {
  try {
    const tecnicos = await tecnicosService.listarTecnicos();
    res.json(tecnicos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarTecnicos,
};