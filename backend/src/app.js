const express = require('express');
const cors = require('cors');

const incidenciasRoutes = require('./routes/incidencias.routes');
const tecnicosRoutes = require('./routes/tecnicos.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tecnicos', tecnicosRoutes);
app.use('/api/incidencias', incidenciasRoutes);

module.exports = app;