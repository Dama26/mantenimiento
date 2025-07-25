const Gasto = require('../models/gasto.model');

const getAll = async (req, res) => {
  const data = await Gasto.getAllGastos();
  res.json(data);
};

const getById = async (req, res) => {
  const gasto = await Gasto.getGastoById(req.params.id);
  if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
  res.json(gasto);
};

const create = async (req, res) => {
  const { mantenimiento_id } = req.body;
  const isValid = await Gasto.validateMantenimientoId(mantenimiento_id);
  if (!isValid) {
    return res.status(400).json({ error: 'ID de mantenimiento no válido' });
  }

  const id = await Gasto.createGasto(req.body);
  res.status(201).json({ id, ...req.body });
};

const update = async (req, res) => {
  const { id } = req.params;
  const existing = await Gasto.getGastoById(id);
  if (!existing) return res.status(404).json({ error: 'Gasto no encontrado' });

  const { mantenimiento_id } = req.body;
  const isValid = await Gasto.validateMantenimientoId(mantenimiento_id);
  if (!isValid) {
    return res.status(400).json({ error: 'ID de mantenimiento no válido' });
  }

  await Gasto.updateGasto(id, req.body);
  res.json({ message: 'Gasto actualizado' });
};

const remove = async (req, res) => {
  const { id } = req.params;
  const existing = await Gasto.getGastoById(id);
  if (!existing) return res.status(404).json({ error: 'Gasto no encontrado' });

  await Gasto.deleteGasto(id);
  res.json({ message: 'Gasto eliminado' });
};

module.exports = { getAll, getById, create, update, remove };
