// 404 for unknown routes
const notFound = (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
};

// Central error handler: converts every error into a JSON response
const errorHandler = (err, req, res, next) => {
  // Mongoose schema validation failed -> 400
  if (err.name === 'ValidationError') {
    const details = {};
    for (const [field, e] of Object.entries(err.errors)) details[field] = e.message;
    return res.status(400).json({ error: 'Validation failed', details });
  }
  // Wrong data type, e.g. salary: "abc" -> 400
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for '${err.path}'` });
  }
  // Duplicate key (unique index) -> 409
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({ error: `Duplicate value: ${fields} already exists` });
  }
  // Malformed JSON body -> 400
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }
  // Anything else (database down, bugs) -> 500
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = { notFound, errorHandler };
