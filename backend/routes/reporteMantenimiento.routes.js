
const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteMantenimiento.controller');

router.post('/', async (req, res) => {
  try {
    const filtros = req.body;
    const reporte = await reporteController.generarReporte(filtros);
    res.json(reporte);
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

module.exports = router;