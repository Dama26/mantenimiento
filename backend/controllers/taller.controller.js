const Taller = require('../models/taller.model');

const getAll = async (req, res) => {
  const data = await Taller.getAllTalleres();
  res.json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const taller = await Taller.getTallerById(id);
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(taller);
};

const create = async (req, res) => {
  const id = await Taller.createTaller(req.body);
  res.status(201).json({ id, ...req.body });
};

const update = async (req, res) => {
  const { id } = req.params;
  const exists = await Taller.getTallerById(id);
  if (!exists) return res.status(404).json({ error: 'Taller no encontrado' });

  await Taller.updateTaller(id, req.body);
  res.json({ message: 'Taller actualizado' });
};

const remove = async (req, res) => {
  const { id } = req.params;
  const exists = await Taller.getTallerById(id);
  if (!exists) return res.status(404).json({ error: 'Taller no encontrado' });

  await Taller.deleteTaller(id);
  res.json({ message: 'Taller eliminado' });
};

module.exports = { getAll, getById, create, update, remove };
