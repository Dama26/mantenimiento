const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/user.model');
require('dotenv').config();

const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  const user = await findUserByEmail(correo);
  const valid = await bcrypt.compare(contrasena, user.contrasena);

  if (!valid || !user) return res.status(401).json({ error: 'Credenciales Inválidas' });

  const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
};

const register = async (req, res) => {
  const { nombre, correo, rol, contrasena } = req.body;

  const existingUser = await findUserByEmail(correo);
  if (existingUser) return res.status(400).json({ error: 'Correo ya registrado' });

  const hashedPassword = await bcrypt.hash(contrasena, 10);
  const userId = await createUser({ nombre, correo, rol, contrasena: hashedPassword });

  res.status(201).json({ id: userId, nombre, correo, rol });
};

module.exports = { login, register };
