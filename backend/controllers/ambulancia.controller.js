const Ambulancia = require('../models/ambulancia.model');

const getAll = async (req, res) => {
  const data = await Ambulancia.getAllAmbulancias();
  res.json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const ambulancia = await Ambulancia.getAmbulanciaByUnidad(id);
  if (!ambulancia) return res.status(404).json({ error: 'Ambulancia no encontrada' });
  res.json(ambulancia);
};

const create = async (req, res) => {
  const id = await Ambulancia.createAmbulancia(req.body);
  res.status(201).json({ id, ...req.body });
};

const update = async (req, res) => {
  const { id } = req.params;
  const existing = await Ambulancia.getAmbulanciaById(id);
  if (!existing) return res.status(404).json({ error: 'Ambulancia no encontrada' });

  await Ambulancia.updateAmbulancia(id, req.body);
  res.json({ message: 'Ambulancia actualizada' });
};

const remove = async (req, res) => {
  const { id } = req.params;
  const existing = await Ambulancia.getAmbulanciaById(id);
  if (!existing) return res.status(404).json({ error: 'Ambulancia no encontrada' });

  await Ambulancia.deleteAmbulancia(id);
  res.json({ message: 'Ambulancia eliminada' });
};

module.exports = { getAll, getById, create, update, remove };
