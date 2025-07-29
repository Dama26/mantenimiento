const express = require('express');
const reporteRoutes = require('./routes/reporteMantenimiento.routes');
const userRoutes = require('./routes/user.routes');
const mantenimientoRoutes = require('./routes/mantenimiento.routes');
const gastoRoutes = require('./routes/gasto.routes');
const tallerRoutes = require('./routes/taller.routes');
const ambulanciaRoutes = require('./routes/ambulancia.routes');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());

app.use('/api/reportes-mantenimientos', reporteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ambulancias', ambulanciaRoutes);
app.use('/api/talleres', tallerRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/usuarios', userRoutes);




app.get('/home', (req, res) => {
  res.send('API de Mantenimiento en funcionamiento');
});

const PORT = process.env.WEB_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

