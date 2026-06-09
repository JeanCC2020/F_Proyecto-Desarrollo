const validateRegistrarIncidencia = (req, res, next) => {
  const { codigoEquipo, problema, usuarioResponsable, registradoPor } = req.body;

  if (!codigoEquipo || typeof codigoEquipo !== 'string' || !/^[A-Za-z0-9-]+$/.test(codigoEquipo.trim())) {
    return res.status(400).json({ error: 'Código de equipo inválido o vacío. Solo se permiten letras, números y guiones.' });
  }
  if (!problema || typeof problema !== 'string' || problema.trim().length < 5) {
    return res.status(400).json({ error: 'El problema presentado debe tener al menos 5 caracteres.' });
  }
  if (!usuarioResponsable || typeof usuarioResponsable !== 'string' || usuarioResponsable.trim() === '') {
    return res.status(400).json({ error: 'El usuario responsable es obligatorio.' });
  }
  if (!registradoPor || typeof registradoPor !== 'string' || registradoPor.trim() === '') {
    return res.status(400).json({ error: 'El campo de registrado por es obligatorio.' });
  }

  next();
};

const validateActualizarIncidencia = (req, res, next) => {
  const { tecnicoId, nuevoEstado, informe, repuesto } = req.body;

  if (tecnicoId) {
    if (typeof tecnicoId !== 'string' || tecnicoId.trim() === '') {
      return res.status(400).json({ error: 'El ID del técnico es inválido.' });
    }
  }

  if (nuevoEstado) {
    const estadosValidos = ['Pendiente', 'Asignada', 'En proceso', 'En espera de repuesto', 'Resuelta', 'Cerrada'];
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado de incidencia no válido.' });
    }
  }

  if (informe) {
    if (typeof informe !== 'string' || informe.trim().length < 5) {
      return res.status(400).json({ error: 'El informe técnico debe tener al menos 5 caracteres.' });
    }
  }

  if (repuesto) {
    if (typeof repuesto !== 'string' || repuesto.trim() === '') {
      return res.status(400).json({ error: 'El repuesto solicitado no puede estar vacío.' });
    }
  }

  next();
};

module.exports = {
  validateRegistrarIncidencia,
  validateActualizarIncidencia
};
