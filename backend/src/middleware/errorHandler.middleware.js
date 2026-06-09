const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por middleware:', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocurrió un error interno en el servidor.';

  res.status(statusCode).json({
    error: message
  });
};

module.exports = errorHandler;
