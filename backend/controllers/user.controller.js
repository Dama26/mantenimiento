const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
  const users = await User.getAllUsers();
  res.json(users);
};

const getById = async (req, res) => {
  const user = await User.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
};

const create = async (req, res) => {
  const { nombre, correo, rol, contrasena } = req.body;
  const existing = await User.findUserByEmail(correo);
  if (existing) return res.status(400).json({ error: 'Correo ya registrado' });

  const hashed = await bcrypt.hash(contrasena, 10);
  const id = await User.createUser({ nombre, correo, rol, contrasena: hashed });

  res.status(201).json({ id, nombre, correo, rol });
};

const update = async (req, res) => {
  const { id } = req.params;
  const existing = await User.getUserById(id);
  if (!existing) return res.status(404).json({ error: 'Usuario no encontrado' });

  await User.updateUser(id, req.body);
  res.json({ message: 'Usuario actualizado' });
};

const remove = async (req, res) => {
  const { id } = req.params;
  const existing = await User.getUserById(id);
  if (!existing) return res.status(404).json({ error: 'Usuario no encontrado' });

  await User.deleteUser(id);
  res.json({ message: 'Usuario eliminado' });
};

module.exports = { getAll, getById, create, update, remove };
