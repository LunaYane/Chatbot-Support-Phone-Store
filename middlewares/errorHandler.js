function notFoundHandler(req, res, next) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found.' });
  }

  return next();
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = Number(error.status || error.statusCode || 500);
  const message = error.message || 'Internal server error.';

  return res.status(status).json({ message });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
