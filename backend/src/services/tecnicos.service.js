const tecnicosRepository = require('../repositories/tecnicos.repository');

const listarTecnicos = async () => {
  const { data, error } = await tecnicosRepository.findAll();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  listarTecnicos,
};