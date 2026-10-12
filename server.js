require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(express.json());                       // parse JSON request bodies

app.get('/', (req, res) => res.json({ message: 'Employee Management API is running' }));
app.use('/api/employees', require('./routes/employees'));

app.use(notFound);                             // must come after all routes
app.use(errorHandler);                         // must be the last middleware

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
